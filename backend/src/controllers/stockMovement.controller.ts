import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";

import {
  createStockMovement,
  getStockMovements,
} from "../services/stockMovement.service";

import {
  createStockMovementSchema,
} from "../validations/stockMovement.validation";

export const addStockMovement = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const data = createStockMovementSchema.parse(req.body);

    const result = await createStockMovement(
      data.productId,
      data.quantity,
      data.movementType,
      data.reason,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Stock movement recorded successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create stock movement",
    });
  }
};

export const listStockMovements = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = req.query.productId as
      | string
      | undefined;

    const movements = await getStockMovements(productId);

    return res.status(200).json({
      success: true,
      data: movements,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stock movements",
    });
  }
};