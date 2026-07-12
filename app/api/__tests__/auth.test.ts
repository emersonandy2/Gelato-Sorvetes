import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../auth/otp/route";

// Mock the auth service
vi.mock("@/features/auth/services/auth.service", () => ({
  authService: {
    sendOtp: vi.fn().mockResolvedValue({
      success: true,
      message: "Código enviado com sucesso!",
    }),
  },
}));

describe("Auth OTP API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends OTP with valid email", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("rejects invalid email", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("rejects missing email", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
