import { randomUUID } from "crypto";

export interface SmsMessage {
  id: string;
  to: string;
  body: string;
  sentAt: string;
}

export interface CallLog {
  id: string;
  to: string;
  note: string;
  createdAt: string;
}

/**
 * TwilioService mimics Twilio interactions by storing records in memory.
 */
class TwilioService {
  private readonly messages: SmsMessage[] = [];
  private readonly calls: CallLog[] = [];

  /**
   * Sends an SMS by recording it in memory.
   */
  public sendSms(to: string, body: string): SmsMessage {
    const message: SmsMessage = {
      id: randomUUID(),
      to,
      body,
      sentAt: new Date().toISOString(),
    };
    this.messages.unshift(message);
    return message;
  }

  /**
   * Returns the SMS log.
   */
  public listMessages(): SmsMessage[] {
    return [...this.messages];
  }

  /**
   * Records a call event.
   */
  public logCall(to: string, note: string): CallLog {
    const call: CallLog = {
      id: randomUUID(),
      to,
      note,
      createdAt: new Date().toISOString(),
    };
    this.calls.unshift(call);
    return call;
  }

  /**
   * Returns the call log.
   */
  public listCalls(): CallLog[] {
    return [...this.calls];
  }
}

export const twilioService = new TwilioService();

export type TwilioServiceType = TwilioService;
