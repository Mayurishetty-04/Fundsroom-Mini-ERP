import { Router } from "express";

import {
  addStockMovement,
  listStockMovements,
} from "../controllers/stockMovement.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  listStockMovements
);

router.post(
  "/",
  authorize("ADMIN", "WAREHOUSE"),
  addStockMovement
);

export default router;