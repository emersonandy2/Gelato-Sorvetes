import { Resend } from "resend";
import { authRepository } from "../repositories/auth.repository";
import { signToken, verifyToken, type TokenPayload } from "@/lib/jwt";
import type { SendOtpResponse, VerifyOtpResponse } from "../types/auth.types";

const resend = new Resend(process.env.RESEND_API_KEY);

export class AuthService {
  async sendOtp(email: string): Promise<SendOtpResponse> {
    try {
      const otpCode = await authRepository.createOtpCode(email);

      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM || "noreply@gelato.com",
        to: email,
        subject: "Seu código de verificação - Gelato & Sorvetes",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #e11d48, #f43f5e); border-radius: 16px; padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🍦 Gelato & Sorvetes</h1>
                <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Seu código de verificação</p>
                
                <div style="background: white; border-radius: 12px; padding: 30px; margin: 30px 0;">
                  <p style="color: #374151; margin: 0 0 10px 0;">Use o código abaixo para acessar sua conta:</p>
                  <div style="font-size: 48px; font-weight: bold; color: #e11d48; letter-spacing: 8px; padding: 20px;">
                    ${otpCode.code}
                  </div>
                  <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">
                    Este código expira em 5 minutos.
                  </p>
                </div>

                <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
                  Se você não solicitou este código, ignore este email.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error("Error sending email:", error);
        // In development, return success but log the error for debugging
        if (process.env.NODE_ENV === "development") {
          console.log(`\n========================================`);
          console.log(`[DEV] OTP Code for ${email}: ${otpCode.code}`);
          console.log(`========================================\n`);
          return {
            success: true,
            message: `Código de verificação: ${otpCode.code} (verifique o console)`,
          };
        }
        return {
          success: false,
          message: "Erro ao enviar email. Verifique o domínio no Resend.",
        };
      }

      return {
        success: true,
        message: "Código enviado com sucesso!",
      };
    } catch (error) {
      console.error("Error in sendOtp:", error);
      return {
        success: false,
        message: "Erro interno. Tente novamente.",
      };
    }
  }

  async verifyOtp(email: string, code: string): Promise<VerifyOtpResponse> {
    try {
      const isValid = await authRepository.verifyOtpCode(email, code);

      if (!isValid) {
        return {
          success: false,
          message: "Código inválido ou expirado.",
        };
      }

      const user = await authRepository.findOrCreateUser(email);

      const token = await signToken({
        userId: user.id,
        email: user.email,
      });

      return {
        success: true,
        message: "Autenticado com sucesso!",
        user: {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
          phone: user.phone || undefined,
          createdAt: user.createdAt,
        },
        token,
      };
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      return {
        success: false,
        message: "Erro interno. Tente novamente.",
      };
    }
  }

  async getSession(token: string) {
    try {
      const payload = await verifyToken<TokenPayload>(token);
      if (!payload) return null;

      const user = await authRepository.findUserByEmail(payload.email);
      if (!user) return null;

      return {
        userId: user.id,
        email: user.email,
        name: user.name || undefined,
        phone: user.phone || undefined,
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
