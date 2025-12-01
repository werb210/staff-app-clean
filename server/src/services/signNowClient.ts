// (Wrapper only, service does the saving)

export const signNowClient = {
  async sendEnvelope(toEmail: string, pdfBuffer: Buffer) {
    // actual API call in controller — this file simply defines the shape
    return { envelopeId: "mock-id" };
  }
};
