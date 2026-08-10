import { Router } from "express";
import {
  addCustomer,
  listCustomers,
  getCustomer,
  editCustomer,
} from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "SALES"),
  listCustomers
);

router.get(
  "/:id",
  authorize("ADMIN", "SALES"),
  getCustomer
);

router.post(
  "/",
  authorize("ADMIN", "SALES"),
  addCustomer
);

router.put(
  "/:id",
  authorize("ADMIN", "SALES"),
  editCustomer
);

export default router;