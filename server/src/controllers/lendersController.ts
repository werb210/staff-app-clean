// FILE: server/src/controllers/lendersController.ts
import { Request, Response } from "express";
import lendersService from "../services/lendersService.js";

export const getAllLenders = async (_req: Request, res: Response) => {
  res.json(await lendersService.getAllLenders());
};

export const getLenderProducts = async (req: Request, res: Response) => {
  res.json(await lendersService.getLenderProducts(req.params.lenderId));
};

export default {
  getAllLenders,
  getLenderProducts,
};
