import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive("Preço deve ser positivo"),
  size: z.string().optional(),
  ingredients: z.string().optional(),
  preparationTime: z.number().int().positive().optional(),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  promotion: z.boolean().default(false),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  images: z.array(z.string()).min(1, "Pelo menos uma imagem é necessária"),
});

export const productSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  promotion: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z
    .enum(["price-asc", "price-desc", "name-asc", "name-desc", "newest"])
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductSearchParams = z.infer<typeof productSearchSchema>;
