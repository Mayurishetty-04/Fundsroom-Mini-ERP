import { z } from "zod";

export const createCustomerSchema = z.object({
  customerName: z.string().min(2),
  mobile: z.string().min(10).max(15),
  email: z.string().email(),
  businessName: z.string().min(2),
  gstNumber: z.string().optional(),
  customerType: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]),
  address: z.string().min(3),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).default("LEAD"),
  followUpDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const updateCustomerSchema =
  createCustomerSchema.partial();