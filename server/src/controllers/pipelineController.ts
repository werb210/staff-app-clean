// server/src/controllers/pipelineController.ts
import type { Request, Response } from "express";
import prisma from "../db/prisma";

export const pipelineController = {
  async list(_req: Request, res: Response) {
    const rows = await prisma.pipeline.findMany();
    res.json({ ok: true, data: rows });
  },

  async get(req: Request, res: Response) {
    const row = await prisma.pipeline.findUnique({
      where: { id: req.params.id },
    });

    if (!row) return res.status(404).json({ ok: false });
    res.json({ ok: true, data: row });
  },

  async create(req: Request, res: Response) {
    const inserted = await prisma.pipeline.create({
      data: req.body,
    });

    res.json({ ok: true, data: inserted });
  },

  async update(req: Request, res: Response) {
    const updated = await prisma.pipeline.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ ok: true, data: updated });
  },

  async remove(req: Request, res: Response) {
    await prisma.pipeline.delete({
      where: { id: req.params.id },
    });

    res.json({ ok: true });
  },
};
