import { verifyToken, type TokenPayload } from "./jwt";

export async function getAuthUser(): Promise<TokenPayload | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken<TokenPayload>(token);
}

export async function getAdminUser(): Promise<(TokenPayload & { role: string }) | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;
  const payload = await verifyToken<TokenPayload & { role: string }>(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function requireAuth(): Promise<TokenPayload> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(): Promise<TokenPayload & { role: string }> {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}
