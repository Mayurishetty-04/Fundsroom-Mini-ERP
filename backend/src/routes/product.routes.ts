import { Router } from "express";

import {
  addProduct,
  listProducts,
  getProduct,
  editProduct,
} from "../controllers/product.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  listProducts
);

router.get(
  "/:id",
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  getProduct
);

router.post(
  "/",
  authorize("ADMIN", "WAREHOUSE"),
  addProduct
);

router.put(
  "/:id",
  authorize("ADMIN", "WAREHOUSE"),
  editProduct
);

export default router;