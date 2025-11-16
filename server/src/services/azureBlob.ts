// server/src/services/azureBlob.ts
export const azureBlob = {
  async upload(_file: Buffer, _key: string) {
    return { ok: true, url: "https://example.com/mock-upload" };
  },
};
