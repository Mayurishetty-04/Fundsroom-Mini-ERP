import { Router } from "express";

import {
  addChallan,
  listChallans,
  getChallan,
  confirm,
} from "../controllers/challan.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  listChallans
);

router.get(
  "/:id",
  authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  getChallan
);

router.post(
  "/",
  authorize("ADMIN", "SALES"),
  addChallan
);

router.put(
  "/:id/confirm",
  authorize("ADMIN", "SALES"),
  confirm
);

export default router;