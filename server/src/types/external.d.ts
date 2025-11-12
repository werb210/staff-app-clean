declare module "twilio" {
  export interface Twilio {
    messages: any;
    calls: any;
  }
  const twilio: (
    accountSid: string,
    authToken: string,
  ) => Twilio;
  export default twilio;
}

declare module "@sendgrid/mail" {
  export interface MailService {
    setApiKey(key: string): void;
    send(
      data: unknown,
    ): Promise<Array<{ headers: Record<string, unknown>; statusCode?: number }>>;
  }
  const mail: MailService;
  export default mail;
}
