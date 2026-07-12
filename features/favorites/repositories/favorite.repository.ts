import { prisma } from "@/lib/prisma";

export class FavoritesRepository {
  async findByUserAndProduct(userId: string, productId: string) {
    return prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { take: 1 },
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async add(userId: string, productId: string) {
    return prisma.favorite.create({
      data: { userId, productId },
    });
  }

  async remove(userId: string, productId: string) {
    return prisma.favorite.deleteMany({
      where: { userId, productId },
    });
  }

  async isFavorited(userId: string, productId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    return !!favorite;
  }
}

export const favoritesRepository = new FavoritesRepository();
