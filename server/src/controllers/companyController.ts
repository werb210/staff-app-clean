import { companyService } from "../services/companyService.js";

export const companyController = {
  list: async (_req, res) => {
    res.json(await companyService.list());
  },

  get: async (req, res) => {
    res.json(await companyService.get(req.params.id));
  },

  create: async (req, res) => {
    res.json(await companyService.create(req.body));
  },

  update: async (req, res) => {
    res.json(await companyService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    res.json(await companyService.remove(req.params.id));
  },
};
