// server/src/services/productsService.ts
// Placeholder implementation to keep API stable without breaking builds

const notImplemented = { ok: false, error: "Products service not implemented." } as const;

export const productsService = {
  async list() {
    return notImplemented;
  },

  async get(_id: string) {
    return notImplemented;
  },

  async create(_data: unknown) {
    return notImplemented;
  },

  async update(_id: string, _data: unknown) {
    return notImplemented;
  },

  async delete(_id: string) {
    return notImplemented;
  },
};

export default productsService;
