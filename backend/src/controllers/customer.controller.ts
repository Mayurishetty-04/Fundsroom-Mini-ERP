import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
} from "../services/customer.service";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../validations/customer.validation";

export const addCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = createCustomerSchema.parse(req.body);

    const customer = await createCustomer(
      data,
      req.user!.id
    );

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Invalid customer data",
    });
  }
};

export const listCustomers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const search = req.query.search as string | undefined;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getCustomers(
      search,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

export const getCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customer = await getCustomerById(
      req.params.id as string
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};

export const editCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = updateCustomerSchema.parse(req.body);

    const customer = await updateCustomer(
      req.params.id as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Invalid customer data",
    });
  }
};