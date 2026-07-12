import { NextResponse } from "next/server";
import { z } from "zod";

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}

export function validationError(error: z.ZodError) {
  const issues = error.issues || [];
  return NextResponse.json(
    {
      success: false,
      message: "Dados inválidos",
      errors: issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    },
    { status: 400 }
  );
}

export function unauthorizedResponse(message = "Não autenticado") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbiddenResponse(message = "Acesso negado") {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function notFoundResponse(message = "Recurso não encontrado") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function tooManyRequestsResponse(message = "Muitas requisições") {
  return NextResponse.json({ success: false, message }, { status: 429 });
}
