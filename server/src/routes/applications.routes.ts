import { Router } from "express";
import applicationsController from "../controllers/applicationsController.js";

const router = Router();

router.get("/", applicationsController.list);
router.post("/", applicationsController.create);
router.put("/:id", applicationsController.update);
// remove does not exist → route removed
// get does not exist → route removed

export default router;
