// server/src/controllers/pipelineController.ts
import { Request, Response } from "express";
import { pipelineService } from "../services/pipelineService.js";

export const pipelineController = {
  async list(req: Request, res: Response) {
    const rows = await pipelineService.list();
    res.json({ ok: true, data: rows });
  },

  async get(req: Request, res: Response) {
    const row = await pipelineService.get(req.params.id);
    if (!row) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: row });
  },

  async create(req: Request, res: Response) {
    const row = await pipelineService.create(req.body);
    res.json({ ok: true, data: row });
  },

  async update(req: Request, res: Response) {
    const row = await pipelineService.update(req.params.id, req.body);
    res.json({ ok: true, data: row });
  },

  async remove(req: Request, res: Response) {
    await pipelineService.remove(req.params.id);
    res.json({ ok: true });
  },
};
