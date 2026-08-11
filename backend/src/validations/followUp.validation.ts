import { z } from "zod";

export const createFollowUpSchema = z.object({
  note: z.string().min(2, "Follow-up note is required"),
  followUpDate: z.string().datetime().optional(),
});