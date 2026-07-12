import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, "Código deve ter pelo menos 3 caracteres"),
  discount: z.number().positive("Desconto deve ser positivo"),
  type: z.enum(["percentage", "fixed"]).default("percentage"),
  minOrder: z.number().min(0).optional(),
  maxUses: z.number().int().positive().optional(),
  startDate: z.date(),
  endDate: z.date(),
  active: z.boolean().default(true),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  orderTotal: z.number().min(0),
});

export type CouponInput = z.infer<typeof couponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
