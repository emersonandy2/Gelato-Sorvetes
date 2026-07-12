import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function generateOTP(length: number = 6): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte % 10).join("");
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatZipCode(zipCode: string): string {
  const cleaned = zipCode.replace(/\D/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return zipCode;
}

/**
 * Recursively converts Prisma Decimal objects to plain numbers.
 * This is needed because Prisma returns Decimal objects which cannot be
 * serialized when passed from Server Components to Client Components.
 */
export function serializeDecimal<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Check if it's a Prisma Decimal object
  // Prisma Decimal has internal properties: s (sign), e (exponent), d (digits)
  if (typeof obj === "object" && "s" in obj && "e" in obj && "d" in obj) {
    try {
      // Try to convert to number using the Decimal's valueOf or Number()
      const num = Number(obj as unknown);
      if (!isNaN(num)) {
        return num as T;
      }
    } catch {
      // If conversion fails, continue
    }
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeDecimal(item)) as T;
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeDecimal(value);
    }
    return result as T;
  }

  return obj;
}
