import { z } from "zod";

export const createStockMovementSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be greater than 0"),
  movementType: z.enum(["IN", "OUT"]),
  reason: z.string().min(2, "Reason is required"),
});