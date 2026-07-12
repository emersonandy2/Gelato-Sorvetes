"use server";

import { authService } from "../services/auth.service";
import { emailSchema, otpSchema } from "@/lib/validation/auth.schema";
import { rateLimit } from "@/lib/rate-limit";

export async function sendOtpAction(email: string) {
  // Rate limit: 3 OTP requests per 15 minutes per email
  const { allowed } = rateLimit(`otp:${email}`, 3, 15 * 60 * 1000);
  if (!allowed) {
    return { success: false, message: "Muitas tentativas. Aguarde 15 minutos." };
  }

  const validatedFields = emailSchema.safeParse({ email });
  if (!validatedFields.success) {
    return { success: false, message: "Email inválido." };
  }

  return authService.sendOtp(validatedFields.data.email);
}

export async function verifyOtpAction(email: string, code: string) {
  // Rate limit: 5 verification attempts per 10 minutes per email
  const { allowed } = rateLimit(`verify:${email}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return { success: false, message: "Muitas tentativas. Aguarde 10 minutos." };
  }

  const validatedFields = otpSchema.safeParse({ email, code });
  if (!validatedFields.success) {
    return { success: false, message: "Dados inválidos." };
  }

  const { cookies } = await import("next/headers");
  const result = await authService.verifyOtp(validatedFields.data.email, validatedFields.data.code);

  if (result.success && result.token) {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
  }

  return result;
}

export async function getSessionAction(token: string) {
  return authService.getSession(token);
}
