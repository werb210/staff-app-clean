// server/src/controllers/lendersController.ts
import { Request, Response } from "express";
import { lendersService } from "../services/lendersService.js";

export const lendersController = {
  async list(req: Request, res: Response) {
    const lenders = await lendersService.list();
    res.json({ ok: true, data: lenders });
  },

  async get(req: Request, res: Response) {
    const row = await lendersService.get(req.params.id);
    if (!row) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: row });
  },

  async create(req: Request, res: Response) {
    const row = await lendersService.create(req.body);
    res.json({ ok: true, data: row });
  },

  async update(req: Request, res: Response) {
    const row = await lendersService.update(req.params.id, req.body);
    res.json({ ok: true, data: row });
  },

  async remove(req: Request, res: Response) {
    await lendersService.remove(req.params.id);
    res.json({ ok: true });
  },
};
