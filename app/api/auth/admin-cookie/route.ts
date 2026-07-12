import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token não fornecido" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set admin token cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Erro ao configurar sessão" },
      { status: 500 }
    );
  }
}
