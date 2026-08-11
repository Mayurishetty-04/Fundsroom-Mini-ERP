import { z } from "zod";

export const createProductSchema = z.object({
  productName: z.string().min(2, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  unitPrice: z.coerce.number().positive("Unit price must be greater than 0"),
  currentStock: z.coerce.number().int().min(0).default(0),
  minimumStockQuantity: z.coerce.number().int().min(0).default(0),
  warehouseLocation: z.string().min(1, "Warehouse location is required"),
});

export const updateProductSchema = createProductSchema.partial();