import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  createWorkOrder,
  getWorkOrders,
} from "../services/workOrder.service";

export const addWorkOrder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      locationId,
      productId,
      requiredQuantity,
      assignedUserId,
    } = req.body;

    if (
      !locationId ||
      !productId ||
      !assignedUserId ||
      requiredQuantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Location, product, required quantity and assigned user are required",
      });
    }

    const quantity = Number(requiredQuantity);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required quantity must be a positive whole number",
      });
    }

    const workOrder = await createWorkOrder({
      locationId: String(locationId),
      productId: String(productId),
      requiredQuantity: quantity,
      assignedUserId: String(assignedUserId),
    });

    return res.status(201).json({
      success: true,
      message: "Work order created successfully",
      data: workOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create work order",
    });
  }
};

export const listWorkOrders = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const workOrders = await getWorkOrders();

    return res.status(200).json({
      success: true,
      data: workOrders,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch work orders",
    });
  }
};