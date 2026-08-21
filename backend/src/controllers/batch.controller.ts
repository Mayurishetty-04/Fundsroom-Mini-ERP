import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  createBatch,
  getBatches,
} from "../services/batch.service";

export const addBatch = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      productId,
      batchNumber,
      expiryDate,
    } = req.body;

    if (!productId || !batchNumber) {
      return res.status(400).json({
        success: false,
        message: "Product ID and batch number are required",
      });
    }

    let parsedExpiryDate: Date | undefined;

    if (expiryDate) {
      parsedExpiryDate = new Date(expiryDate);

      if (isNaN(parsedExpiryDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiry date",
        });
      }
    }

    const batch = await createBatch({
      productId: String(productId),
      batchNumber: String(batchNumber),
      expiryDate: parsedExpiryDate,
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create batch",
    });
  }
};

export const listBatches = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId =
      typeof req.query.productId === "string"
        ? req.query.productId
        : undefined;

    const batches = await getBatches(productId);

    return res.status(200).json({
      success: true,
      data: batches,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
    });
  }
};