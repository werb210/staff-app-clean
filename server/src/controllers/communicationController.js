// controllers/communicationController.js
// ---------------------------------------------------------
// Communication Center Controller
// Supports: SMS, Calls, Email, Templates
// ---------------------------------------------------------

import twilio from "twilio";
import sgMail from "@sendgrid/mail";

// Twilio
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Temporary in-memory storage for templates
const templateStore = new Map();

// Helper
const siloPrefix = (silo) => `[${silo.toUpperCase()}]`;

// ---------------------------------------------------------
// SMS
// ---------------------------------------------------------

export const getSmsThreads = async (req, res) => {
  const { silo } = req.params;

  res.json({
    ok: true,
    silo,
    threads: [], // replace when DB integration is ready
  });
};

export const getSmsThreadById = async (req, res) => {
  const { silo, threadId } = req.params;

  res.json({
    ok: true,
    silo,
    threadId,
    messages: [],
  });
};

export const sendSmsMessage = async (req, res) => {
  const { silo, threadId } = req.params;
  const { to, message } = req.body;

  if (!twilioClient) {
    return res.status(500).json({ ok: false, error: "Twilio not configured" });
  }

  try {
    const result = await twilioClient.messages.create({
      to,
      from: process.env.TWILIO_SMS_NUMBER,
      body: `${siloPrefix(silo)} ${message}`,
    });

    res.json({ ok: true, threadId, sid: result.sid });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

// ---------------------------------------------------------
// CALLS
// ---------------------------------------------------------

export const getCallLogs = async (req, res) => {
  res.json({
    ok: true,
    logs: [],
  });
};

export const initiateCall = async (req, res) => {
  const { to } = req.body;

  if (!twilioClient) {
    return res.status(500).json({ ok: false, error: "Twilio not configured" });
  }

  try {
    const call = await twilioClient.calls.create({
      to,
      from: process.env.TWILIO_VOICE_NUMBER,
      url: process.env.TWILIO_VOICE_WEBHOOK_URL,
    });

    res.json({ ok: true, sid: call.sid });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

// ---------------------------------------------------------
// EMAIL
// ---------------------------------------------------------

export const getEmailThreads = async (req, res) => {
  res.json({
    ok: true,
    threads: [],
  });
};

export const getEmailThreadById = async (req, res) => {
  const { threadId } = req.params;

  res.json({
    ok: true,
    threadId,
    messages: [],
  });
};

export const sendEmailMessage = async (req, res) => {
  const { silo, threadId } = req.params;
  const { to, subject, html } = req.body;

  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({ ok: false, error: "SendGrid not configured" });
  }

  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM,
      subject: `${siloPrefix(silo)} ${subject}`,
      html,
    });

    res.json({ ok: true, threadId });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

// ---------------------------------------------------------
// TEMPLATES
// ---------------------------------------------------------

export const getTemplates = async (req, res) => {
  res.json({
    ok: true,
    templates: Array.from(templateStore.values()),
  });
};

export const createTemplate = async (req, res) => {
  const { name, body } = req.body;
  const id = crypto.randomUUID();

  const template = { id, name, body };
  templateStore.set(id, template);

  res.json({ ok: true, template });
};

export const updateTemplate = async (req, res) => {
  const { templateId } = req.params;
  const { name, body } = req.body;

  if (!templateStore.has(templateId)) {
    return res.status(404).json({ ok: false, error: "Template not found" });
  }

  const updated = { id: templateId, name, body };
  templateStore.set(templateId, updated);

  res.json({ ok: true, template: updated });
};

export const deleteTemplate = async (req, res) => {
  const { templateId } = req.params;

  if (!templateStore.has(templateId)) {
    return res.status(404).json({ ok: false, error: "Template not found" });
  }

  templateStore.delete(templateId);

  res.json({ ok: true, deleted: templateId });
};
