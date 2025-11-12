import twilio, { type Twilio } from "twilio";
import { randomUUID } from "crypto";
import { logError, logInfo } from "../utils/logger.js";

export type SMSDirection = "incoming" | "outgoing";
export type SMSDeliveryStatus = "queued" | "sent" | "failed";

export interface SMSMessageRecord {
  id: string;
  contactId: string;
  to: string;
  from: string;
  direction: SMSDirection;
  message: string;
  status: SMSDeliveryStatus;
  createdAt: string;
  providerSid?: string;
  sentBy?: string;
  metadata?: Record<string, unknown>;
}

export interface SMSThread {
  contactId: string;
  lastMessageAt: string | null;
  messages: SMSMessageRecord[];
}

export interface SendSMSPayload {
  to: string;
  from?: string;
  body: string;
  sentBy?: string;
  metadata?: Record<string, unknown>;
}

const smsMessages: SMSMessageRecord[] = [];
let smsClient: Twilio | null = null;

const getTwilioClient = (): Twilio | null => {
  if (smsClient) {
    return smsClient;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    logInfo("Twilio credentials missing, SMS will be queued only");
    return null;
  }

  smsClient = twilio(accountSid, authToken);
  return smsClient;
};

const resolveFromNumber = (provided?: string): string => {
  if (provided && provided.trim().length > 0) {
    return provided;
  }

  const configured = process.env.SMS_FROM_NUMBER;
  if (!configured) {
    throw new Error("SMS sender number not configured");
  }

  return configured;
};

const sortByDateDesc = (a: SMSMessageRecord, b: SMSMessageRecord): number =>
  new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();

export const getThreads = async (): Promise<SMSThread[]> => {
  const grouped = new Map<string, SMSMessageRecord[]>();

  for (const message of smsMessages) {
    const bucket = grouped.get(message.contactId) ?? [];
    bucket.push(message);
    grouped.set(message.contactId, bucket);
  }

  return Array.from(grouped.entries())
    .map(([contactId, messages]) => {
      const ordered = [...messages].sort(sortByDateDesc);
      return {
        contactId,
        lastMessageAt: ordered[0]?.createdAt ?? null,
        messages: ordered,
      };
    })
    .sort((a, b) => {
      if (!a.lastMessageAt && !b.lastMessageAt) {
        return 0;
      }
      if (!a.lastMessageAt) {
        return 1;
      }
      if (!b.lastMessageAt) {
        return -1;
      }
      return new Date(b.lastMessageAt).valueOf() - new Date(a.lastMessageAt).valueOf();
    });
};

export const getThread = async (contactId: string): Promise<SMSThread> => {
  const messages = smsMessages
    .filter((message) => message.contactId === contactId)
    .sort(sortByDateDesc);

  return {
    contactId,
    lastMessageAt: messages[0]?.createdAt ?? null,
    messages,
  };
};

export const sendSMS = async (
  contactId: string,
  payload: SendSMSPayload,
): Promise<SMSMessageRecord> => {
  const createdAt = new Date().toISOString();
  const from = resolveFromNumber(payload.from);

  const record: SMSMessageRecord = {
    id: randomUUID(),
    contactId,
    to: payload.to,
    from,
    message: payload.body,
    direction: "outgoing",
    status: "queued",
    createdAt,
    sentBy: payload.sentBy,
    metadata: payload.metadata,
  };

  smsMessages.unshift(record);

  const client = getTwilioClient();

  if (!client) {
    record.status = "sent";
    return record;
  }

  client.messages
    .create({
      to: payload.to,
      from,
      body: payload.body,
    })
    .then((response: { sid?: string }) => {
      record.status = "sent";
      record.providerSid = response.sid;
      logInfo("SMS sent via Twilio", {
        contactId,
        sid: response.sid,
      });
    })
    .catch((error: unknown) => {
      record.status = "failed";
      logError("Failed to send SMS via Twilio", error);
    });

  return record;
};
