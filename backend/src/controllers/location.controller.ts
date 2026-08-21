import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";

import {
  createLocation,
  getLocations,
} from "../services/location.service";

export const addLocation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Location name and code are required",
      });
    }

    const location = await createLocation({
      name: String(name).trim(),
      code: String(code).trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create location",
    });
  }
};

export const listLocations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const locations = await getLocations();

    return res.status(200).json({
      success: true,
      data: locations,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
    });
  }
};