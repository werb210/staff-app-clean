// server/src/services/timelineService.ts
import { logEvent } from "./auditService.js";

interface ActivityPayload {
  applicationId: string;
  type: string;
  message: string;
  userId?: string;
}

export async function addActivity(payload: ActivityPayload) {
  const { applicationId, type, message, userId } = payload;
  await logEvent({
    eventType: "timeline",
    applicationId,
    userId: userId ?? null,
    details: { type, message },
  });

  return payload;
}
