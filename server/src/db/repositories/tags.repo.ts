import { randomUUID } from "crypto";

const tags: Array<{ id: string; name: string }> = [];

export const tagsRepo = {
  async listAll() {
    return [...tags];
  },

  async create(name: string) {
    const tag = { id: randomUUID(), name };
    tags.push(tag);
    return tag;
  },

  async remove(id: string) {
    const idx = tags.findIndex((tag) => tag.id === id);
    if (idx === -1) return null;
    const [deleted] = tags.splice(idx, 1);
    return deleted;
  },
};

export default tagsRepo;
