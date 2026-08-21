import { Router } from "express";

import {
  addBatch,
  listBatches,
} from "../controllers/batch.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  listBatches
);

router.post(
  "/",
  authorize("ADMIN", "WAREHOUSE"),
  addBatch
);

export default router;