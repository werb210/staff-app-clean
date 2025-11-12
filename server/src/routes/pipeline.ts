import { Router } from "express";
import {
  getApplicationDataHandler,
  getApplicationDocumentsHandler,
  getApplicationLendersHandler,
  getCards,
  getStages,
  moveCardHandler,
} from "../controllers/pipelineController.js";

const router = Router();

router.get("/stages", getStages);
router.get("/cards", getCards);
router.put("/cards/:id/move", moveCardHandler);
router.get("/cards/:id/application", getApplicationDataHandler);
router.get("/cards/:id/documents", getApplicationDocumentsHandler);
router.get("/cards/:id/lenders", getApplicationLendersHandler);

export default router;
