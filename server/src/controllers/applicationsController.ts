// server/src/controllers/applicationsController.ts
import { applicationsService } from "../services/applicationsService.js";

export const applicationsController = {
  async list(req, res) {
    res.json(await applicationsService.list());
  },

  async get(req, res) {
    res.json(await applicationsService.get(req.params.id));
  },

  async create(req, res) {
    res.json(await applicationsService.create(req.body));
  },

  async update(req, res) {
    res.json(await applicationsService.update(req.params.id, req.body));
  },

  async remove(req, res) {
    res.json(await applicationsService.delete(req.params.id));
  },
};
