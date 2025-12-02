import signaturesRepo from "../db/repositories/signatures.repo.js";

export const signingService = {
  requestSignature(applicationId: string, details: any) {
    return signaturesRepo.create({
      applicationId,
      details,
      signedBlobKey: details?.signedBlobKey ?? null,
      signNowDocumentId: details?.signNowDocumentId ?? null,
      createdAt: new Date(),
    });
  },

  list(applicationId: string) {
    return signaturesRepo.findMany({ applicationId });
  },

  listSignedDocuments(applicationId: string) {
    return signaturesRepo
      .findMany({ applicationId })
      .then((rows) => rows.filter((row) => Boolean(row.signedBlobKey)));
  },
};

export default signingService;
