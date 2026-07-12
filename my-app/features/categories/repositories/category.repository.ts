import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      where: { active: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async create(data: { name: string; slug?: string; image?: string; sortOrder?: number }) {
    const slug = data.slug || slugify(data.name);

    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        image: data.image,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async update(
    id: string,
    data: { name?: string; slug?: string; image?: string; sortOrder?: number; active?: boolean }
  ) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = slugify(data.name);
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}

export const categoryRepository = new CategoryRepository();
