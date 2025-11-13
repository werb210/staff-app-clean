import twilio, { type Twilio } from "twilio";
import { randomUUID } from "crypto";

// Fallback-safe logger loader
let safeLogInfo: (msg: string, meta?: any) => void = console.log;
let safeLogError: (msg: string, meta?: any) => void = console.error;

try {
  const { logInfo, logError } = await import("../utils/logger.js");
  safeLogInfo = logInfo ?? console.log;
  safeLogError = logError ?? console.error;
} catch {
  // logger missing — fallback already set
}

/* -----------------------------------------------------
   Types
----------------------------------------------------- */

export type SMSDirection = "incoming" | "outgoing";
export type SMSDeliveryStatus = "queued" | "sent" | "failed";

export interface SMSMessageRecord {
  id: string;
  contactId: string;
  to: string;
  from: string;
  message: string;
  direction: SMSDirection;
  status: SMSDeliveryStatus;
  createdAt: string;
  sentBy?: string;
  providerSid?: string;
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

/* -----------------------------------------------------
   Internal Storage (temporary)
----------------------------------------------------- */

const smsMessages: SMSMessageRecord[] = [];
let smsClient: Twilio | null = null;

/* -----------------------------------------------------
   Twilio Client Initializer
----------------------------------------------------- */

const getTwilioClient = (): Twilio | null => {
  if (smsClient) return smsClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    safeLogInfo("Twilio credentials missing — SMS will be queued only");
    return null;
  }

  smsClient = twilio(accountSid, authToken);
  return smsClient;
};

/* -----------------------------------------------------
   Silo-based From Number Resolution (BF / SLF)
----------------------------------------------------- */

const resolveFromNumber = (provided?: string): string => {
  if (provided && provided.trim().length > 0) return provided;

  const silo = process.env.APP_SILO?.toUpperCase() ?? "BF";
  const bfNumber = process.env.BF_SMS_NUMBER;
  const slfNumber = process.env.SLF_SMS_NUMBER;

  if (silo === "SLF") {
    if (!slfNumber) throw new Error("SLF_SMS_NUMBER not configured");
    return slfNumber;
  }

  if (!bfNumber) throw new Error("BF_SMS_NUMBER not configured");
  return bfNumber;
};

/* -----------------------------------------------------
   Thread Helpers
----------------------------------------------------- */

const sortByDateDesc = (a: SMSMessageRecord, b: SMSMessageRecord) =>
  new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();

/* -----------------------------------------------------
   Public: List All Threads
----------------------------------------------------- */

export const getThreads = async (): Promise<SMSThread[]> => {
  const grouped = new Map<string, SMSMessageRecord[]>();

  for (const message of smsMessages) {
    const group = grouped.get(message.contactId) ?? [];
    group.push(message);
    grouped.set(message.contactId, group);
  }

  return Array.from(grouped.entries())
    .map(([contactId, list]) => {
      const ordered = [...list].sort(sortByDateDesc);
      return {
        contactId,
        lastMessageAt: ordered[0]?.createdAt ?? null,
        messages: ordered,
      };
    })
    .sort((a, b) => {
      if (!a.lastMessageAt && !b.lastMessageAt) return 0;
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return (
        new Date(b.lastMessageAt).valueOf() -
        new Date(a.lastMessageAt).valueOf()
      );
    });
};

/* -----------------------------------------------------
   Public: Get Single Thread
----------------------------------------------------- */

export const getThread = async (contactId: string): Promise<SMSThread> => {
  const messages = smsMessages
    .filter((msg) => msg.contactId === contactId)
    .sort(sortByDateDesc);

  return {
    contactId,
    lastMessageAt: messages[0]?.createdAt ?? null,
    messages,
  };
};

/* -----------------------------------------------------
   Public: Send SMS
----------------------------------------------------- */

export const sendSMS = async (
  contactId: string,
  payload: SendSMSPayload,
): Promise<SMSMessageRecord> => {
  const createdAt = new Date().toISOString();

  const from = resolveFromNumber(payload.from);

  const record: SMSMessageRecord = {
    id: randomUUID(),
    contactId,
    to: payload.to.trim(),
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

  try {
    const response = await client.messages.create({
      to: payload.to.trim(),
      from,
      body: payload.body,
    });

    record.status = "sent";
    record.providerSid = response.sid;
    safeLogInfo("SMS sent via Twilio", {
      contactId,
      sid: response.sid,
    });
  } catch (err: unknown) {
    record.status = "failed";
    safeLogError("Failed to send SMS via Twilio", err);
  }

  return record;
};

/* -----------------------------------------------------
   Public: Record an Inbound SMS
----------------------------------------------------- */

export const recordInboundSMS = (
  contactId: string,
  payload: {
    from: string;
    to: string;
    body: string;
    metadata?: Record<string, unknown>;
  },
): SMSMessageRecord => {
  const createdAt = new Date().toISOString();

  const record: SMSMessageRecord = {
    id: randomUUID(),
    contactId,
    to: payload.to.trim(),
    from: payload.from.trim(),
    message: payload.body,
    direction: "incoming",
    status: "sent",
    createdAt,
    metadata: payload.metadata,
  };

  smsMessages.unshift(record);
  return record;
};

/* -----------------------------------------------------
   Export Class Wrapper
----------------------------------------------------- */

export class SMSService {
  async sendMessage(contactId: string, payload: SendSMSPayload) {
    return sendSMS(contactId, payload);
  }

  recordInbound(contactId: string, payload: { from: string; to: string; body: string }) {
    return recordInboundSMS(contactId, payload);
  }

  listAllThreads() {
    return getThreads();
  }

  listThread(contactId: string) {
    return getThread(contactId);
  }
}

export const smsService = new SMSService();
