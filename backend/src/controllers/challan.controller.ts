import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";

import {
  createChallan,
  confirmChallan,
  getChallans,
  getChallanById,
} from "../services/challan.service";

import {
  createChallanSchema,
} from "../validations/challan.validation";

export const addChallan = async (
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

    const data = createChallanSchema.parse(
      req.body
    );

    const challan = await createChallan(
      data.customerId,
      data.items,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Challan created successfully",
      data: challan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create challan",
    });
  }
};

export const listChallans = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const challans = await getChallans();

    return res.status(200).json({
      success: true,
      data: challans,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch challans",
    });
  }
};

export const getChallan = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const challan = await getChallanById(
      req.params.id as string
    );

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Challan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: challan,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch challan",
    });
  }
};

export const confirm = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const challan = await confirmChallan(
      req.params.id as string
    );

    return res.status(200).json({
      success: true,
      message: "Challan confirmed successfully",
      data: challan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to confirm challan",
    });
  }
};