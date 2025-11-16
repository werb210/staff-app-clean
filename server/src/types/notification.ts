// server/src/types/notification.ts

export interface Notification {
  id: string;
  type: "email" | "sms";
  createdAt: number;
}
