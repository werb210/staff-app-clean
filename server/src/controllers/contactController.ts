import { contactService } from "../services/contactService.js";

export const contactController = {
  list: async (_req, res) => {
    res.json(await contactService.list());
  },

  get: async (req, res) => {
    res.json(await contactService.get(req.params.id));
  },

  create: async (req, res) => {
    res.json(await contactService.create(req.body));
  },

  update: async (req, res) => {
    res.json(await contactService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    res.json(await contactService.remove(req.params.id));
  },
};
