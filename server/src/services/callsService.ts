import twilio, { type Twilio } from "twilio";
import { randomUUID } from "crypto";

/* -----------------------------------------------------
   Safe Logger Loader
----------------------------------------------------- */
let safeLogInfo: (msg: string, meta?: any) => void = console.log;
let safeLogError: (msg: string, meta?: any) => void = console.error;

try {
  const { logInfo, logError } = await import("../utils/logger.js");
  safeLogInfo = logInfo ?? console.log;
  safeLogError = logError ?? console.error;
} catch {
  // logger missing — defaults already set
}

/* -----------------------------------------------------
   Types
----------------------------------------------------- */

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

/* -----------------------------------------------------
   In-Memory Storage (temporary)
----------------------------------------------------- */

const calls: CallRecord[] = [];
const callEvents: CallTimelineEvent[] = [];
let voiceClient: Twilio | null = null;

/* -----------------------------------------------------
   Twilio Voice Client
----------------------------------------------------- */

const getVoiceClient = (): Twilio | null => {
  if (voiceClient) return voiceClient;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    safeLogInfo("Twilio Voice not configured — calls will not be made");
    return null;
  }

  voiceClient = twilio(sid, token);
  return voiceClient;
};

/* -----------------------------------------------------
   BF / SLF Silo Caller ID Logic
----------------------------------------------------- */

const resolveCallerId = (override?: string): string => {
  if (override && override.trim()) return override;

  const silo = process.env.APP_SILO?.toUpperCase() ?? "BF";

  const bfVoice = process.env.BF_VOICE_NUMBER;
  const slfVoice = process.env.SLF_VOICE_NUMBER;

  if (silo === "SLF") {
    if (!slfVoice) throw new Error("SLF_VOICE_NUMBER missing");
    return slfVoice;
  }

  if (!bfVoice) throw new Error("BF_VOICE_NUMBER missing");
  return bfVoice;
};

/* -----------------------------------------------------
   Timeline Utility
----------------------------------------------------- */

const pushTimeline = (
  callId: string,
  contactId: string,
  event: CallTimelineEvent["event"],
  description: string
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

/* -----------------------------------------------------
   Errors
----------------------------------------------------- */

export class CallNotFoundError extends Error {
  constructor(id: string) {
    super(`Call not found: ${id}`);
    this.name = "CallNotFoundError";
  }
}

/* -----------------------------------------------------
   Public: List All Calls
----------------------------------------------------- */

export const getCalls = async (): Promise<CallRecord[]> => {
  return calls
    .slice()
    .sort(
      (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
    )
    .map((call) => ({
      ...call,
      timeline: callEvents
        .filter((e) => e.callId === call.id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).valueOf() -
            new Date(b.createdAt).valueOf()
        ),
    }));
};

/* -----------------------------------------------------
   Public: Initiate a Call
----------------------------------------------------- */

export const initiateCall = async (
  contactId: string,
  options: InitiateCallOptions
): Promise<CallRecord> => {
  const now = new Date().toISOString();
  const callerId = resolveCallerId(options.from);

  const record: CallRecord = {
    id: randomUUID(),
    contactId,
    to: options.to.trim(),
    from: callerId,
    direction: "outgoing",
    status: "initiated",
    duration: 0,
    createdAt: now,
    updatedAt: now,
    initiatedBy: options.initiatedBy,
    context: options.context,
    timeline: [],
  };

  calls.unshift(record);
  pushTimeline(record.id, contactId, "initiated", "Call created locally");

  const client = getVoiceClient();

  if (!client) {
    record.status = "queued";
    record.updatedAt = new Date().toISOString();
    return {
      ...record,
      timeline: callEvents.filter((e) => e.callId === record.id),
    };
  }

  try {
    const twilioCall = await client.calls.create({
      to: record.to,
      from: callerId,
      statusCallback: `${process.env.PUBLIC_API_URL}/api/voice/status`,
      statusCallbackEvent: [
        "initiated",
        "ringing",
        "answered",
        "completed",
        "busy",
        "no-answer",
        "failed",
      ],
      statusCallbackMethod: "POST",
      twiml:
        "<Response><Say voice=\"alice\">Connecting your call from Boreal Financial Communications.</Say></Response>",
    });

    record.providerSid = twilioCall.sid;
    record.status = (twilioCall.status as CallStatus) ?? "ringing";
    record.updatedAt = new Date().toISOString();
    pushTimeline(record.id, contactId, "ringing", "Twilio reported ringing");

    safeLogInfo("Outbound call initiated (Twilio)", {
      sid: twilioCall.sid,
      contactId,
    });
  } catch (err: unknown) {
    record.status = "failed";
    record.updatedAt = new Date().toISOString();
    pushTimeline(record.id, contactId, "failed", "Twilio call failed");
    safeLogError("Failed to initiate Twilio call", err);
  }

  return {
    ...record,
    timeline: callEvents
      .filter((e) => e.callId === record.id)
      .sort(
        (a, b) =>
          new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
      ),
  };
};

/* -----------------------------------------------------
   Public: End a Call
----------------------------------------------------- */

export const endCall = async (callId: string): Promise<CallRecord> => {
  const record = calls.find((c) => c.id === callId);
  if (!record) throw new CallNotFoundError(callId);

  const now = new Date();
  const startAt = new Date(record.createdAt);
  record.duration = Math.max(
    0,
    Math.round((now.valueOf() - startAt.valueOf()) / 1000)
  );
  record.status = "completed";
  record.updatedAt = now.toISOString();
  pushTimeline(record.id, record.contactId, "completed", "Call completed");

  if (record.providerSid) {
    const client = getVoiceClient();
    client
      ?.calls(record.providerSid)
      .update({ status: "completed" })
      .catch((err: unknown) => safeLogError("Twilio endCall update failed", err));
  }

  return {
    ...record,
    timeline: callEvents
      .filter((e) => e.callId === record.id)
      .sort(
        (a, b) =>
          new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
      ),
  };
};
