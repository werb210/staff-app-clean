import { Router, Request, Response } from "express";
const router = Router();

router.get("/api/applications", (_req: Request, res: Response) => {
    res.json({ status: "ok", data: [] });
});

export default router;
