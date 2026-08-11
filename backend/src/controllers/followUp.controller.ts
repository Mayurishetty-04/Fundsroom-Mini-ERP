import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import { createFollowUp } from "../services/followUp.service";

import {
  createFollowUpSchema,
} from "../validations/followUp.validation";

export const addFollowUp = async (
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

    const data = createFollowUpSchema.parse(req.body);

    const followUp = await createFollowUp(
      req.params.id as string,
      data.note,
      data.followUpDate,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Follow-up added successfully",
      data: followUp,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to add follow-up",
    });
  }
};