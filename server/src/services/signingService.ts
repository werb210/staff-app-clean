import { signaturesRepo } from "../db/repositories/signatures.repo";

export const signingService = {
  async markSent(applicationId: string, envelopeId: string) {
    return signaturesRepo.insert({
      applicationId,
      envelopeId,
      status: "sent",
      createdAt: new Date()
    });
  },

  async markCompleted(envelopeId: string, data: any) {
    return signaturesRepo.updateByEnvelopeId(envelopeId, {
      status: "completed",
      completedAt: new Date(),
      metadata: data
    });
  }
};
