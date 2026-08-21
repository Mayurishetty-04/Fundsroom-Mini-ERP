import { Router } from "express";

import {
  addWorkOrder,
  listWorkOrders,
} from "../controllers/workOrder.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "WAREHOUSE", "SALES", "ACCOUNTS"),
  listWorkOrders
);

router.post(
  "/",
  authorize("ADMIN"),
  addWorkOrder
);

export default router;