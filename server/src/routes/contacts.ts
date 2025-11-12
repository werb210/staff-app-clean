import { Router } from "express";
import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  getTimelineForContact,
  updateContact,
} from "../controllers/contactsController.js";

const router = Router();

router.get("/", getContacts);
router.post("/", createContact);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);
router.get("/:id/timeline", getTimelineForContact);

export default router;
