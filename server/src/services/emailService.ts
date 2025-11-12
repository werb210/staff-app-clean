import { randomUUID } from "crypto";
import axios from "axios";
import sendGridMail from "@sendgrid/mail";
import { logError, logInfo } from "../utils/logger.js";

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

export interface EmailThread {
  contactId: string;
  lastMessageAt: string | null;
  messages: EmailMessageRecord[];
}

export interface EmailSendOptions {
  to?: string;
  userEmail?: string;
  sendAsSystem?: boolean;
  sentBy?: string;
  metadata?: Record<string, unknown>;
}

export interface RecordInboundEmailOptions {
  from: string;
  to: string;
  subject: string;
  body: string;
  metadata?: Record<string, unknown>;
}

const emailMessages: EmailMessageRecord[] = [];
const contactDirectory = new Map<string, string>();
let isSendGridConfigured = false;

const configureSendGrid = (): void => {
  if (isSendGridConfigured) {
    return;
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    return;
  }

  sendGridMail.setApiKey(apiKey);
  isSendGridConfigured = true;
};

const registerContactEmail = (contactId: string, email: string): void => {
  if (email.trim().length > 0) {
    contactDirectory.set(contactId, email.trim().toLowerCase());
  }
};

const resolveContactEmail = (contactId: string, fallback?: string): string => {
  if (fallback && fallback.trim().length > 0) {
    registerContactEmail(contactId, fallback);
    return fallback;
  }

  const found = contactDirectory.get(contactId);
  if (!found) {
    throw new Error(`Contact ${contactId} email is unknown`);
  }
  return found;
};

const sendEmailWithSendGrid = async (
  record: EmailMessageRecord,
): Promise<void> => {
  configureSendGrid();

  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL ?? record.from;

  if (!apiKey || !fromEmail) {
    record.status = "failed";
    logError("SendGrid not fully configured", { recordId: record.id });
    return;
  }

  try {
    const [response] = await sendGridMail.send({
      to: record.to,
      from: fromEmail,
      subject: record.subject,
      html: record.body,
      text: record.body,
    });
    record.status = "sent";
    record.providerMessageId =
      (response.headers["x-message-id"] as string | undefined) ?? undefined;
    logInfo("Email sent via SendGrid", { recordId: record.id });
  } catch (error) {
    record.status = "failed";
    logError("Failed to send email via SendGrid", error);
  }
};

const sendEmailWithGraph = async (
  record: EmailMessageRecord,
  senderEmail: string,
): Promise<void> => {
  const tenantId = process.env.O365_TENANT_ID;
  const clientId = process.env.O365_CLIENT_ID;
  const clientSecret = process.env.O365_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    record.status = "failed";
    logError("Microsoft Graph not configured", { recordId: record.id });
    return;
  }

  try {
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const accessToken = tokenResponse.data?.access_token as string | undefined;
    if (!accessToken) {
      throw new Error("Access token missing from Graph response");
    }

    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`,
      {
        message: {
          subject: record.subject,
          body: {
            contentType: "HTML",
            content: record.body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: record.to,
              },
            },
          ],
        },
        saveToSentItems: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    record.status = "sent";
    logInfo("Email dispatched via Microsoft Graph", { recordId: record.id });
  } catch (error) {
    record.status = "failed";
    logError("Failed to send email via Microsoft Graph", error);
  }
};

export const getEmailThreads = async (
  contactId: string,
): Promise<EmailThread> => {
  const messages = emailMessages
    .filter((message) => message.contactId === contactId)
    .sort(
      (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    );

  return {
    contactId,
    lastMessageAt: messages[0]?.createdAt ?? null,
    messages,
  };
};

export const sendEmail = async (
  contactId: string,
  subject: string,
  body: string,
  options: EmailSendOptions = {},
): Promise<EmailMessageRecord> => {
  const createdAt = new Date().toISOString();
  const recipient = resolveContactEmail(contactId, options.to);
  registerContactEmail(contactId, recipient);
  const sendAsSystem = options.sendAsSystem ?? false;
  const senderEmail = sendAsSystem
    ? process.env.SENDGRID_FROM_EMAIL ?? process.env.O365_SENDER_EMAIL ?? "noreply@staff.local"
    : options.userEmail ?? process.env.O365_SENDER_EMAIL ?? "noreply@staff.local";

  const record: EmailMessageRecord = {
    id: randomUUID(),
    contactId,
    to: recipient,
    from: senderEmail,
    subject,
    body,
    direction: "outgoing",
    status: "queued",
    provider: sendAsSystem ? "sendgrid" : "graph",
    createdAt,
    sentBy: options.sentBy,
    metadata: options.metadata,
  };

  emailMessages.unshift(record);

  if (sendAsSystem) {
    void sendEmailWithSendGrid(record);
  } else {
    void sendEmailWithGraph(record, senderEmail);
  }

  return record;
};

export const recordInboundEmail = (
  contactId: string,
  payload: RecordInboundEmailOptions,
): EmailMessageRecord => {
  registerContactEmail(contactId, payload.from);
  const createdAt = new Date().toISOString();

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
    createdAt,
    metadata: payload.metadata,
  };

  emailMessages.unshift(record);
  return record;
};

export interface EmailMessage {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  sentAt: string;
  status: "queued" | "sent" | "failed";
  direction: "inbound" | "outbound";
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

const mapRecordToLegacy = (record: EmailMessageRecord): EmailMessage => ({
  id: record.id,
  to: record.to,
  from: record.from,
  subject: record.subject,
  body: record.body,
  sentAt: record.createdAt,
  status: record.status,
  direction: record.direction === "outgoing" ? "outbound" : "inbound",
});

export class EmailService {
  public async sendEmail(payload: EmailPayload): Promise<EmailMessage> {
    const record = await sendEmail(payload.to, payload.subject, payload.body, {
      to: payload.to,
      sendAsSystem: true,
      metadata: { legacy: true, from: payload.from },
    });

    return mapRecordToLegacy(record);
  }

  public receiveEmail(payload: {
    from: string;
    to: string;
    subject: string;
    body: string;
  }): EmailMessage {
    const record = recordInboundEmail(payload.from, {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
    });

    return mapRecordToLegacy(record);
  }

  public listEmails(): EmailMessage[] {
    return emailMessages.map((message) => mapRecordToLegacy(message));
  }

  public listThreads(): Array<{ contact: string; messages: EmailMessage[] }> {
    const grouped = new Map<string, EmailMessage[]>();

    for (const record of emailMessages) {
      const contact = record.direction === "outgoing" ? record.to : record.from;
      const legacy = mapRecordToLegacy(record);
      const bucket = grouped.get(contact) ?? [];
      bucket.push(legacy);
      grouped.set(contact, bucket);
    }

    return Array.from(grouped.entries()).map(([contact, messages]) => ({
      contact,
      messages: messages.sort((a, b) => b.sentAt.localeCompare(a.sentAt)),
    }));
  }
}

export const emailService = new EmailService();
export type EmailServiceType = EmailService;
export const createEmailService = (): EmailService => new EmailService();
