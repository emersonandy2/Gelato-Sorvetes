import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/auth/services/auth.service";
import { otpSchema } from "@/lib/validation/auth.schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validate input
    const validatedFields = otpSchema.safeParse({ email, code });

    if (!validatedFields.success) {
      return NextResponse.json(
        { success: false, message: "Dados inválidos." },
        { status: 400 }
      );
    }

    const result = await authService.verifyOtp(
      validatedFields.data.email,
      validatedFields.data.code
    );

    if (result.success) {
      // Set cookie with token
      const response = NextResponse.json(result);

      if (result.token) {
        response.cookies.set("auth-token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: "/",
        });
      }

      return response;
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Erro interno." },
      { status: 500 }
    );
  }
}
