import { Router } from "express";

import {
  listLenders,
  getLender,
  createLender,
  updateLender,
  deleteLender,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  sendToLender,
  generateReports,
} from "../controllers/lenderController.js";

const router = Router();

/* ------------------------------------------------------------------
   LENDERS
------------------------------------------------------------------- */

router.get("/", listLenders);
router.get("/:id", getLender);
router.post("/", createLender);
router.put("/:id", updateLender);
router.delete("/:id", deleteLender);

/* ------------------------------------------------------------------
   PRODUCTS (scoped under lender)
------------------------------------------------------------------- */

router.get("/:lenderId/products", listProducts);
router.post("/:lenderId/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

/* ------------------------------------------------------------------
   SEND TO LENDER (Application → Lender)
------------------------------------------------------------------- */

router.post(
  "/:lenderId/send/:applicationId",
  sendToLender
);

/* ------------------------------------------------------------------
   REPORTS
------------------------------------------------------------------- */

router.get("/reports/all", generateReports);

export default router;
