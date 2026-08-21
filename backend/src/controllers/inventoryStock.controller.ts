import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  createInventoryStock,
  getInventoryStocks,
} from "../services/inventoryStock.service";

export const addInventoryStock = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      productId,
      locationId,
      batchId,
      physicalQuantity,
      reservedQuantity,
    } = req.body;

    if (
      !productId ||
      !locationId ||
      !batchId ||
      physicalQuantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product, location, batch and physical quantity are required",
      });
    }

    const physical = Number(physicalQuantity);
    const reserved =
      reservedQuantity === undefined
        ? 0
        : Number(reservedQuantity);

    if (!Number.isInteger(physical) || !Number.isInteger(reserved)) {
      return res.status(400).json({
        success: false,
        message: "Quantities must be whole numbers",
      });
    }

    const inventory = await createInventoryStock({
      productId: String(productId),
      locationId: String(locationId),
      batchId: String(batchId),
      physicalQuantity: physical,
      reservedQuantity: reserved,
    });

    return res.status(201).json({
      success: true,
      message: "Inventory stock created successfully",
      data: inventory,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create inventory stock",
    });
  }
};

export const listInventoryStocks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId =
      typeof req.query.productId === "string"
        ? req.query.productId
        : undefined;

    const locationId =
      typeof req.query.locationId === "string"
        ? req.query.locationId
        : undefined;

    const stocks = await getInventoryStocks({
      productId,
      locationId,
    });

    return res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory stocks",
    });
  }
};