import { z } from "zod";

export const createChallanSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),

  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product ID"),
        quantity: z.coerce
          .number()
          .int()
          .positive("Quantity must be greater than 0"),
      })
    )
    .min(1, "At least one product is required"),
});