import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  slug: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive("Preço deve ser positivo"),
  size: z.string().max(50).optional(),
  ingredients: z.string().max(1000).optional(),
  preparationTime: z.number().int().positive().optional(),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  promotion: z.boolean().optional(),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional() })).max(10).optional(),
  customizations: z.array(z.object({
    name: z.string().min(1),
    price: z.number().positive(),
  })).max(20).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  slug: z.string().max(100).optional(),
  icon: z.string().max(10).optional(),
  image: z.string().url().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]),
});

export const createCouponSchema = z.object({
  code: z.string().min(3, "Código deve ter pelo menos 3 caracteres").max(50),
  discount: z.number().positive("Desconto deve ser positivo"),
  type: z.enum(["percentage", "fixed"]).optional(),
  minOrder: z.number().min(0).optional(),
  maxUses: z.number().int().positive().optional(),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
});

export const updateStoreSettingsSchema = z.record(z.string(), z.string());
