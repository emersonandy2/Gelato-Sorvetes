import { prisma } from "@/lib/prisma";
import type { ProductFilters, PaginatedProducts } from "../types/product.types";
import { slugify, serializeDecimal } from "@/lib/utils";
import { PRODUCT_PAGE_SIZE } from "@/lib/constants";

export class ProductRepository {
  async findMany(filters: ProductFilters): Promise<PaginatedProducts> {
    const {
      query,
      category,
      featured,
      promotion,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = PRODUCT_PAGE_SIZE,
    } = filters;

    const where: Record<string, unknown> = {
      available: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { ingredients: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (promotion !== undefined) {
      where.promotion = promotion;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        (where.price as Record<string, unknown>).gte = minPrice;
      }
      if (maxPrice !== undefined) {
        (where.price as Record<string, unknown>).lte = maxPrice;
      }
    }

    const orderBy = (() => {
      switch (sort) {
        case "price-asc":
          return { price: "asc" as const };
        case "price-desc":
          return { price: "desc" as const };
        case "name-asc":
          return { name: "asc" as const };
        case "name-desc":
          return { name: "desc" as const };
        case "newest":
        default:
          return { createdAt: "desc" as const };
      }
    })();

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          customizations: { where: { available: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: serializeDecimal(products) as unknown as PaginatedProducts["products"],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        customizations: { where: { available: true } },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return serializeDecimal(product);
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        customizations: { where: { available: true } },
      },
    });
    return serializeDecimal(product);
  }

  async findFeatured(limit: number = 8) {
    const products = await prisma.product.findMany({
      where: { available: true, featured: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return serializeDecimal(products);
  }

  async findOnPromotion(limit: number = 8) {
    const products = await prisma.product.findMany({
      where: { available: true, promotion: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return serializeDecimal(products);
  }

  async findRelated(categoryId: string, productId: string, limit: number = 4) {
    const products = await prisma.product.findMany({
      where: {
        available: true,
        categoryId,
        id: { not: productId },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return serializeDecimal(products);
  }

  async create(data: {
    name: string;
    slug?: string;
    description?: string;
    price: number;
    size?: string;
    ingredients?: string;
    preparationTime?: number;
    stock?: number;
    available?: boolean;
    featured?: boolean;
    promotion?: boolean;
    categoryId: string;
    images?: { url: string; alt?: string }[];
    customizations?: { name: string; price: number }[];
  }) {
    const slug = data.slug || slugify(data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        size: data.size,
        ingredients: data.ingredients,
        preparationTime: data.preparationTime,
        stock: data.stock ?? 0,
        available: data.available ?? true,
        featured: data.featured ?? false,
        promotion: data.promotion ?? false,
        categoryId: data.categoryId,
        images: data.images
          ? { create: data.images.map((img, i) => ({ ...img, sortOrder: i })) }
          : undefined,
        customizations: data.customizations
          ? { create: data.customizations }
          : undefined,
      },
      include: {
        images: true,
        category: true,
        customizations: true,
      },
    });
    return serializeDecimal(product);
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      size?: string;
      ingredients?: string;
      preparationTime?: number;
      stock?: number;
      available?: boolean;
      featured?: boolean;
      promotion?: boolean;
      categoryId?: string;
    }
  ) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = slugify(data.name);
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        category: true,
        customizations: true,
      },
    });
    return serializeDecimal(product);
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  async getLowStockProducts(threshold: number = 5) {
    const products = await prisma.product.findMany({
      where: {
        available: true,
        stock: { lte: threshold },
      },
      include: {
        images: { take: 1 },
        category: true,
      },
      orderBy: { stock: "asc" },
    });
    return serializeDecimal(products);
  }
}

export const productRepository = new ProductRepository();
