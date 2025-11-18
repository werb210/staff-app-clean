import { contactsService } from "../services/contactsService.js";

export const contactsController = {
  list: async (_req, res) => {
    res.json(await contactsService.list());
  },

  get: async (req, res) => {
    res.json(await contactsService.get(req.params.id));
  },

  create: async (req, res) => {
    res.json(await contactsService.create(req.body));
  },

  update: async (req, res) => {
    res.json(await contactsService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    res.json(await contactsService.remove(req.params.id));
  },
};
