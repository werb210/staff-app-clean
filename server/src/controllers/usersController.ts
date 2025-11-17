// server/src/controllers/usersController.ts
import { Request, Response } from "express";
import { usersService } from "../services/usersService.js";

export const usersController = {
  async list(req: Request, res: Response) {
    const rows = await usersService.list();
    res.json({ ok: true, data: rows });
  },

  async get(req: Request, res: Response) {
    const row = await usersService.get(req.params.id);
    if (!row) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: row });
  },

  async create(req: Request, res: Response) {
    const row = await usersService.create(req.body);
    res.json({ ok: true, data: row });
  },

  async update(req: Request, res: Response) {
    const row = await usersService.update(req.params.id, req.body);
    res.json({ ok: true, data: row });
  },

  async remove(req: Request, res: Response) {
    await usersService.remove(req.params.id);
    res.json({ ok: true });
  },
};
