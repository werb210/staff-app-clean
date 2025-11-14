import {
  PrismaClient,
  CommunicationType,
  CommunicationDirection,
} from "@prisma/client";

import type { JwtUserPayload } from "../auth/authService.js";
import {
  getTwilioClient,
  resolveNumberForSilo,
} from "./communicationProviders.js";

const prisma = new PrismaClient();

export async function sendSMS(
  contactId: string,
  user: JwtUserPayload,
  body: string,
) {
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  });

  if (!contact) {
    throw new Error("Contact not found");
  }

  if (!contact.phone) {
    throw new Error("Contact does not have a phone number");
  }

  const silo = contact.silo;
  if (!user.silos.includes(silo)) {
    throw new Error("Unauthorized silo access");
  }

  const trimmedBody = body.trim();
  const fromNumber = resolveNumberForSilo(silo);
  const client = getTwilioClient();

  const message = await client.messages.create({
    to: contact.phone,
    from: fromNumber,
    body: trimmedBody,
  });

  return prisma.communicationLog.create({
    data: {
      type: CommunicationType.SMS,
      direction: CommunicationDirection.OUTBOUND,
      contactId,
      silo,
      messageBody: trimmedBody,
      providerMessageId: message.sid,
      sentBy: user.id,
    },
    include: { contact: true },
  });
}

export async function listSMSThreads(user: JwtUserPayload) {
  return prisma.communicationLog.findMany({
    where: {
      type: CommunicationType.SMS,
      silo: { in: user.silos },
    },
    include: { contact: true },
    orderBy: { createdAt: "desc" },
  });
}
