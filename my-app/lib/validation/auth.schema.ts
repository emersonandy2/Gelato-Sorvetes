import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const otpSchema = z.object({
  email: z.string().email("Email inválido"),
  code: z.string().length(6, "Código deve ter 6 dígitos"),
});

export type EmailInput = z.infer<typeof emailSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
