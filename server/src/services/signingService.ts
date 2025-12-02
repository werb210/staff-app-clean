import signaturesRepo from "../db/repositories/signatures.repo.js";

export const signingService = {
  requestSignature(applicationId: string, details: any) {
    return signaturesRepo.create({
      applicationId,
      details,
      createdAt: new Date(),
    });
  },

  list(applicationId: string) {
    return signaturesRepo.findMany({ applicationId });
  },

  listSignedDocuments(applicationId: string) {
    return signaturesRepo.findMany({
      applicationId,
      signedBlobKey: { not: null },
    });
  },
};

export default signingService;
