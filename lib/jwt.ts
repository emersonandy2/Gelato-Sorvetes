import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secretString = process.env.JWT_SECRET || "gelato-dev-secret-change-in-production-min-32-chars!";
  return new TextEncoder().encode(secretString);
}

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export async function signToken(payload: TokenPayload, expiresInSeconds: number = 7 * 24 * 60 * 60): Promise<string> {
  const secret = getSecret();
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(secret);
}

export async function verifyToken<T extends TokenPayload>(token: string): Promise<T | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as T;
  } catch {
    return null;
  }
}
