import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "../services/auth.service";

// Mock the repository
vi.mock("../repositories/auth.repository", () => ({
  authRepository: {
    createOtpCode: vi.fn().mockResolvedValue({ code: "123456" }),
    verifyOtpCode: vi.fn().mockResolvedValue(true),
    findOrCreateUser: vi.fn().mockResolvedValue({
      id: "user-1",
      email: "test@test.com",
      name: null,
      phone: null,
      createdAt: new Date(),
    }),
    findUserByEmail: vi.fn().mockResolvedValue(null),
  },
}));

// Mock the email service
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function () {
    return {
      emails: {
        send: vi.fn().mockResolvedValue({ error: null }),
      },
    };
  }),
}));

// Mock JWT
vi.mock("@/lib/jwt", () => ({
  signToken: vi.fn().mockResolvedValue("mock-jwt-token"),
  verifyToken: vi.fn().mockResolvedValue({ userId: "user-1", email: "test@test.com" }),
}));

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendOtp", () => {
    it("sends OTP successfully", async () => {
      const result = await authService.sendOtp("test@test.com");
      expect(result.success).toBe(true);
      expect(result.message).toContain("sucesso");
    });
  });

  describe("verifyOtp", () => {
    it("verifies OTP successfully", async () => {
      const result = await authService.verifyOtp("test@test.com", "123456");
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });

    it("returns error for invalid OTP", async () => {
      const { authRepository } = await import("../repositories/auth.repository");
      vi.mocked(authRepository.verifyOtpCode).mockResolvedValueOnce(false);

      const result = await authService.verifyOtp("test@test.com", "000000");
      expect(result.success).toBe(false);
    });
  });

  describe("getSession", () => {
    it("returns session for valid token", async () => {
      const session = await authService.getSession("valid-token");
      expect(session).toBeDefined();
    });

    it("returns null for invalid token", async () => {
      const { verifyToken } = await import("@/lib/jwt");
      vi.mocked(verifyToken).mockResolvedValueOnce(null);

      const session = await authService.getSession("invalid-token");
      expect(session).toBeNull();
    });
  });
});
