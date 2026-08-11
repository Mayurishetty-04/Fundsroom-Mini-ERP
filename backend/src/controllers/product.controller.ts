import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "../services/product.service";

import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation";

export const addProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = createProductSchema.parse(req.body);

    const product = await createProduct(data);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Invalid product data",
    });
  }
};

export const listProducts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const search = req.query.search as string | undefined;

    const products = await getProducts(search);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const product = await getProductById(
      req.params.id as string
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export const editProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = updateProductSchema.parse(req.body);

    const product = await updateProduct(
      req.params.id as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Invalid product data",
    });
  }
};