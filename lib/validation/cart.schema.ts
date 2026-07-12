import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
