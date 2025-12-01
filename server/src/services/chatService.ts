import { db } from "../db/db.js";
import { messages } from "../db/schema/messages.js";
import { eq } from "drizzle-orm";
import { communicationService } from "./communicationService.js";

export async function saveChatMessage({ senderId, applicationId, body, attachments }: any) {
  const created = await db
    .insert(messages)
    .values({
      senderId,
      applicationId,
      body,
      attachments,
    })
    .returning();

  await communicationService.logChatActivity({ applicationId, body, senderId });

  return created[0];
}

export async function getChatThread(applicationId: string) {
  return await db.select().from(messages).where(eq(messages.applicationId, applicationId));
}
