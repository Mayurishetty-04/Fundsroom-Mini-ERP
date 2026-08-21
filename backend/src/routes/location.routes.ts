import { Router } from "express";

import {
  addLocation,
  listLocations,
} from "../controllers/location.controller";

import { authenticate } from "../middleware/auth.middleware";

import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "WAREHOUSE"),
  listLocations
);

router.post(
  "/",
  authorize("ADMIN", "WAREHOUSE"),
  addLocation
);

export default router;