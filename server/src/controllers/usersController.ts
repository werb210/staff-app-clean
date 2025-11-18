// server/src/controllers/usersController.ts
import { usersService } from "../services/usersService.js";

export const usersController = {
  async list(req, res) {
    res.json(await usersService.list());
  },

  async get(req, res) {
    res.json(await usersService.get(req.params.id));
  },

  async create(req, res) {
    res.json(await usersService.create(req.body));
  },

  async update(req, res) {
    res.json(await usersService.update(req.params.id, req.body));
  },

  async remove(req, res) {
    res.json(await usersService.delete(req.params.id));
  },
};
