import { Router } from "express";
import searchController from "../controllers/searchController.js";

const router = Router();

// Only search() exists
router.get("/", searchController.search);

export default router;
