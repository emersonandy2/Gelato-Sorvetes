import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/utils";
import { OTP_EXPIRY_MINUTES } from "@/lib/constants";
import type { OtpCode } from "../types/auth.types";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findOrCreateUser(email: string, name?: string) {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    return user;
  }

  async createOtpCode(email: string): Promise<OtpCode> {
    // Invalidate any existing OTP codes for this email
    await prisma.otpCode.updateMany({
      where: {
        email,
        used: false,
      },
      data: {
        used: true,
      },
    });

    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

    const otpCode = await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    return otpCode as OtpCode;
  }

  async verifyOtpCode(email: string, code: string): Promise<boolean> {
    const otpCode = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpCode) {
      return false;
    }

    // Mark the OTP code as used
    await prisma.otpCode.update({
      where: { id: otpCode.id },
      data: { used: true },
    });

    return true;
  }

  async cleanupExpiredOtpCodes(): Promise<void> {
    await prisma.otpCode.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

export const authRepository = new AuthRepository();
