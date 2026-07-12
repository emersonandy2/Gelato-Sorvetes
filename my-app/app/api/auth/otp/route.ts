import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/auth/services/auth.service";
import { emailSchema } from "@/lib/validation/auth.schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    const validatedFields = emailSchema.safeParse({ email });

    if (!validatedFields.success) {
      return NextResponse.json(
        { success: false, message: "Email inválido." },
        { status: 400 }
      );
    }

    const result = await authService.sendOtp(validatedFields.data.email);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Erro interno." },
      { status: 500 }
    );
  }
}
