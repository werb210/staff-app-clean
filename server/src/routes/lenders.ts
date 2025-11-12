import { Router } from "express";
import {
  createLender,
  deleteLender,
  getLenders,
  updateLender,
} from "../controllers/lendersController.js";

const router = Router();

router.get("/", getLenders);
router.post("/", createLender);
router.put("/:id", updateLender);
router.delete("/:id", deleteLender);

export default router;
