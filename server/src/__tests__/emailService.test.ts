import { emailService } from "../services/emailService.js";

describe("emailService", () => {
  it("queues outbound emails", async () => {
    const email = await emailService.sendEmail({
      to: "borrower@example.com",
      subject: "Hello",
      body: "Welcome",
    });

    expect(email.status === "queued" || email.status === "sent").toBe(true);
    expect(emailService.listEmails()).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: email.id })]),
    );
  });
});
