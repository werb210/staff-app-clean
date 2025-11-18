import { dealsService } from "../services/dealsService.js";

export const dealsController = {
  list: async (_req, res) => {
    res.json(await dealsService.list());
  },

  get: async (req, res) => {
    res.json(await dealsService.get(req.params.id));
  },

  create: async (req, res) => {
    res.json(await dealsService.create(req.body));
  },

  update: async (req, res) => {
    res.json(await dealsService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    res.json(await dealsService.remove(req.params.id));
  },
};
