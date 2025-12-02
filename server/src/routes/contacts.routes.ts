// server/src/routes/contacts.routes.ts
import { Router } from "express";
import contactsController from "../controllers/contactsController.js";

const router = Router();

router.get("/", contactsController.list);
router.post("/", contactsController.create);

export default router;
