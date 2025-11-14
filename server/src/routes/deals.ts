import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../auth/authMiddleware.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const deals = await prisma.deal.findMany({
    where: {
      silo: { in: user.silos },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(deals);
});

export default router;
