import { Router } from "express";

import {
  addInventoryStock,
  listInventoryStocks,
} from "../controllers/inventoryStock.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "WAREHOUSE", "SALES", "ACCOUNTS"),
  listInventoryStocks
);

router.post(
  "/",
  authorize("ADMIN", "WAREHOUSE"),
  addInventoryStock
);

export default router;