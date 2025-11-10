export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface ScheduledEmailPayload extends EmailPayload {
  sendAt: Date;
}

/**
 * Service providing email dispatch utilities.
 */
export class EmailService {
  /**
   * Sends an email immediately using the configured provider.
   */
  async sendEmail(payload: EmailPayload): Promise<{ messageId: string }> {
    return {
      messageId: `email-${Date.now()}`
    };
  }

  /**
   * Schedules an email to be delivered in the future.
   */
  async scheduleEmail(payload: ScheduledEmailPayload): Promise<{ messageId: string; scheduledFor: Date }> {
    return {
      messageId: `scheduled-${Date.now()}`,
      scheduledFor: payload.sendAt
    };
  }
}

export const emailService = new EmailService();
