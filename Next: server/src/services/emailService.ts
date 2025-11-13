import { randomUUID } from "crypto";
import axios from "axios";
import sendGridMail from "@sendgrid/mail";

/* -----------------------------------------------------
   Logger (safe fallback)
----------------------------------------------------- */
let safeLogInfo: (msg: string, meta?: any) => void = console.log;
let safeLogError: (msg: string, meta?: any) => void = console.error;

try {
  const { logInfo, logError } = await import("../utils/logger.js");
  safeLogInfo = logInfo ?? console.log;
  safeLogError = logError ?? console.error;
} catch {
  // fallback already set
}

/* -----------------------------------------------------
   Types
----------------------------------------------------- */
export type EmailDirection = "incoming" | "outgoing";
export type EmailStatus = "queued" | "sent" | "failed";
export type EmailProvider = "sendgrid" | "graph" | "manual";

export interface EmailMessageRecord {
  id: string;
  contactId: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  direction: EmailDirection;
  status: EmailStatus;
  provider: EmailProvider;
  createdAt: string;
  sentBy?: string;
  providerMessageId?: string;
  metadata?: Record<string, unknown>;
}

/* -----------------------------------------------------
   TEMP STORAGE (memory only)
----------------------------------------------------- */
const messages: EmailMessageRecord[] = [];
const contactDirectory = new Map<string, string>();

/* -----------------------------------------------------
   SendGrid setup
----------------------------------------------------- */
let sendGridReady = false;

const configureSendGrid = () => {
  if (sendGridReady) return;
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return;
  sendGridMail.setApiKey(key);
  sendGridReady = true;
};

/* -----------------------------------------------------
   Contact resolution
----------------------------------------------------- */
const registerContactEmail = (contactId: string, email: string) => {
  if (email.trim().length > 0) {
    contactDirectory.set(contactId, email.trim().toLowerCase());
  }
};

const resolveContactEmail = (contactId: string, fallback?: string): string => {
  if (fallback) {
    registerContactEmail(contactId, fallback);
    return fallback;
  }
  const found = contactDirectory.get(contactId);
  if (!found) throw new Error(`Unknown email for contact ${contactId}`);
  return found;
};

/* -----------------------------------------------------
   Send via SendGrid
----------------------------------------------------- */
const sendEmailViaSendGrid = async (record: EmailMessageRecord) => {
  configureSendGrid();

  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL ?? record.from;

  if (!key || !from) {
    record.status = "failed";
    safeLogError("SendGrid not configured");
    return;
  }

  try {
    const [response] = await sendGridMail.send({
      to: record.to,
      from,
      subject: record.subject,
      html: record.body,
      text: record.body,
    });

    record.status = "sent";
    record.providerMessageId = response.headers["x-message-id"] as string | undefined;
    safeLogInfo("Email sent via SendGrid", { id: record.id });
  } catch (err) {
    record.status = "failed";
    safeLogError("SendGrid error", err);
  }
};

/* -----------------------------------------------------
   Send via Microsoft Graph
----------------------------------------------------- */
const sendEmailViaGraph = async (
  record: EmailMessageRecord,
  senderEmail: string,
) => {
  const tenantId = process.env.O365_TENANT_ID;
  const clientId = process.env.O365_CLIENT_ID;
  const clientSecret = process.env.O365_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    record.status = "failed";
    safeLogError("Graph not configured");
    return;
  }

  try {
    // token
    const tokenResp = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const accessToken = tokenResp.data?.access_token;
    if (!accessToken) throw new Error("Missing Graph access token");

    // send
    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`,
      {
        message: {
          subject: record.subject,
          body: { contentType: "HTML", content: record.body },
          toRecipients: [{ emailAddress: { address: record.to } }],
        },
        saveToSentItems: true,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    record.status = "sent";
    safeLogInfo("Email sent via Graph", { id: record.id });
  } catch (err) {
    record.status = "failed";
    safeLogError("Graph email error", err);
  }
};

/* -----------------------------------------------------
   Public API
----------------------------------------------------- */
export const sendEmail = async (
  contactId: string,
  subject: string,
  body: string,
  opts: {
    to?: string;
    userEmail?: string;
    sendAsSystem?: boolean;
    sentBy?: string;
    metadata?: Record<string, unknown>;
  } = {},
): Promise<EmailMessageRecord> => {
  const createdAt = new Date().toISOString();
  const to = resolveContactEmail(contactId, opts.to);

  registerContactEmail(contactId, to);

  const senderEmail =
    opts.sendAsSystem
      ? process.env.SENDGRID_FROM_EMAIL ??
        process.env.O365_SENDER_EMAIL ??
        "noreply@staff.local"
      : opts.userEmail ??
        process.env.O365_SENDER_EMAIL ??
        "noreply@staff.local";

  const record: EmailMessageRecord = {
    id: randomUUID(),
    contactId,
    to,
    from: senderEmail,
    subject,
    body,
    direction: "outgoing",
    status: "queued",
    provider: opts.sendAsSystem ? "sendgrid" : "graph",
    createdAt,
    sentBy: opts.sentBy,
    metadata: opts.metadata,
  };

  messages.unshift(record);

  if (opts.sendAsSystem) {
    void sendEmailViaSendGrid(record);
  } else {
    void sendEmailViaGraph(record, senderEmail);
  }

  return record;
};

export const recordInboundEmail = (
  contactId: string,
  payload: {
    from: string;
    to: string;
    subject: string;
    body: string;
    metadata?: Record<string, unknown>;
  },
): EmailMessageRecord => {
  registerContactEmail(contactId, payload.from);

  const record: EmailMessageRecord = {
    id: randomUUID(),
    contactId,
    to: payload.to,
    from: payload.from,
    subject: payload.subject,
    body: payload.body,
    direction: "incoming",
    status: "sent",
    provider: "manual",
    createdAt: new Date().toISOString(),
    metadata: payload.metadata,
  };

  messages.unshift(record);
  return record;
};

/* -----------------------------------------------------
   Listing / Threads
----------------------------------------------------- */
export const getEmailThreads = () => {
  const map = new Map<string, EmailMessageRecord[]>();

  for (const msg of messages) {
    const key = msg.direction === "outgoing" ? msg.to : msg.from;
    const list = map.get(key) ?? [];
    list.push(msg);
    map.set(key, list);
  }

  return Array.from(map.entries()).map(([contact, items]) => ({
    contact,
    messages: items
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((m) => ({
        id: m.id,
        to: m.to,
        from: m.from,
        subject: m.subject,
        body: m.body,
        sentAt: m.createdAt,
        status: m.status,
        direction: m.direction === "outgoing" ? "outbound" : "inbound",
      })),
  }));
};

/* -----------------------------------------------------
   EmailService class wrapper (required by Silos)
----------------------------------------------------- */
export class EmailService {
  public sendEmail = sendEmail;
  public receiveEmail = recordInboundEmail;
  public listThreads = getEmailThreads;
}

export const createEmailService = () => new EmailService();
export type EmailServiceType = EmailService;
export const emailService = new EmailService();
