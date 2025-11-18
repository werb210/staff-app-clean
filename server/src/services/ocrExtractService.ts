// server/src/services/ocrExtractService.ts

export type OcrExtractRecord = {
  documentId: string;
  content: string;
  createdAt: string;
};

const store = new Map<string, OcrExtractRecord>();

const ocrExtractService = {
  async extract(body: { documentId?: string; content?: string }) {
    const documentId = body.documentId?.trim();
    if (!documentId) {
      throw new Error("documentId is required");
    }

    const record: OcrExtractRecord = {
      documentId,
      content: body.content ?? `Extracted content for document ${documentId}`,
      createdAt: new Date().toISOString(),
    };

    store.set(documentId, record);
    return record;
  },

  async getByDocument(documentId: string) {
    const record = store.get(documentId);
    if (!record) {
      throw new Error(`No OCR extract found for document ${documentId}`);
    }
    return record;
  },

  async list() {
    return Array.from(store.values());
  },

  async remove(documentId: string) {
    const record = store.get(documentId);
    if (!record) {
      throw new Error(`No OCR extract found for document ${documentId}`);
    }
    store.delete(documentId);
    return record;
  },
};

export default ocrExtractService;
