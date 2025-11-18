// server/src/controllers/companiesController.ts
import { companiesService } from "../services/companiesService.js";

export const companiesController = {
  async list(req, res) {
    res.json(await companiesService.list());
  },

  async get(req, res) {
    res.json(await companiesService.get(req.params.id));
  },

  async create(req, res) {
    res.json(await companiesService.create(req.body));
  },

  async update(req, res) {
    res.json(await companiesService.update(req.params.id, req.body));
  },

  async remove(req, res) {
    res.json(await companiesService.delete(req.params.id));
  },
};
