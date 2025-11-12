import twilio, { type Twilio } from "twilio";
import { randomUUID } from "crypto";
import { logError, logInfo } from "../utils/logger.js";

export type CallDirection = "incoming" | "outgoing";
export type CallStatus =
  | "initiated"
  | "queued"
  | "ringing"
  | "in-progress"
  | "completed"
  | "failed"
  | "canceled"
  | "busy"
  | "no-answer";

export interface CallTimelineEvent {
  id: string;
  callId: string;
  contactId: string;
  event: "initiated" | "ringing" | "in-progress" | "completed" | "failed";
  description: string;
  createdAt: string;
}

export interface CallRecord {
  id: string;
  contactId: string;
  to: string;
  from: string;
  direction: CallDirection;
  status: CallStatus;
  duration: number;
  createdAt: string;
  updatedAt: string;
  providerSid?: string;
  initiatedBy?: string;
  context?: string;
  timeline: CallTimelineEvent[];
}

export interface InitiateCallOptions {
  to: string;
  from?: string;
  initiatedBy?: string;
  context?: string;
}

const calls: CallRecord[] = [];
const callEvents: CallTimelineEvent[] = [];
let voiceClient: Twilio | null = null;

const getVoiceClient = (): Twilio | null => {
  if (voiceClient) {
    return voiceClient;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    logInfo("Twilio credentials missing, calls will not be placed");
    return null;
  }

  voiceClient = twilio(accountSid, authToken);
  return voiceClient;
};

const resolveCallerId = (provided?: string): string => {
  if (provided && provided.trim().length > 0) {
    return provided;
  }

  const configured = process.env.SMS_FROM_NUMBER;
  if (!configured) {
    throw new Error("Caller ID not configured");
  }

  return configured;
};

const recordTimelineEvent = (
  callId: string,
  contactId: string,
  event: CallTimelineEvent["event"],
  description: string,
): void => {
  callEvents.push({
    id: randomUUID(),
    callId,
    contactId,
    event,
    description,
    createdAt: new Date().toISOString(),
  });
};

export class CallNotFoundError extends Error {
  constructor(id: string) {
    super(`Call ${id} not found`);
    this.name = "CallNotFoundError";
  }
}

export const getCalls = async (): Promise<CallRecord[]> =>
  [...calls]
    .sort(
      (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    )
    .map((call) => ({
      ...call,
      timeline: callEvents
        .filter((event) => event.callId === call.id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
        ),
    }));

export const initiateCall = async (
  contactId: string,
  options: InitiateCallOptions,
): Promise<CallRecord> => {
  const createdAt = new Date().toISOString();
  const callerId = resolveCallerId(options.from);

  const call: CallRecord = {
    id: randomUUID(),
    contactId,
    to: options.to,
    from: callerId,
    direction: "outgoing",
    status: "initiated",
    duration: 0,
    createdAt,
    updatedAt: createdAt,
    initiatedBy: options.initiatedBy,
    context: options.context,
    timeline: [],
  };

  calls.unshift(call);
  recordTimelineEvent(call.id, contactId, "initiated", "Call initiated");

  const client = getVoiceClient();
  if (client) {
    client.calls
      .create({
        to: options.to,
        from: callerId,
        twiml:
          "<Response><Say voice=\"alice\">You have an outbound call from Staff Communications Center.</Say></Response>",
      })
      .then((response) => {
        call.providerSid = response.sid;
        call.status = (response.status as CallStatus) ?? "ringing";
        call.updatedAt = new Date().toISOString();
        recordTimelineEvent(call.id, contactId, "ringing", "Twilio reported ringing state");
        logInfo("Call initiated via Twilio", {
          callId: call.id,
          sid: response.sid,
        });
      })
      .catch((error: unknown) => {
        call.status = "failed";
        call.updatedAt = new Date().toISOString();
        recordTimelineEvent(call.id, contactId, "failed", "Call failed to initiate");
        logError("Failed to initiate call via Twilio", error);
      });
  }

  return {
    ...call,
    timeline: callEvents
      .filter((event) => event.callId === call.id)
      .sort(
        (a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
      ),
  };
};

export const endCall = async (callId: string): Promise<CallRecord> => {
  const call = calls.find((candidate) => candidate.id === callId);
  if (!call) {
    throw new CallNotFoundError(callId);
  }

  const now = new Date();
  const startedAt = new Date(call.createdAt);
  call.duration = Math.max(0, Math.round((now.valueOf() - startedAt.valueOf()) / 1000));
  call.status = "completed";
  call.updatedAt = now.toISOString();

  recordTimelineEvent(call.id, call.contactId, "completed", "Call completed");

  if (call.providerSid) {
    const client = getVoiceClient();
    client?.calls(call.providerSid)
      .update({ status: "completed" })
      .catch((error: unknown) => {
        logError("Failed to end Twilio call", error);
      });
  }

  return {
    ...call,
    timeline: callEvents
      .filter((event) => event.callId === call.id)
      .sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()),
  };
};
