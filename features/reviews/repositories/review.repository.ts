import { prisma } from "@/lib/prisma";

export class ReviewsRepository {
  async findByProductId(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByUserAndProduct(userId: string, productId: string) {
    return prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  async create(userId: string, productId: string, rating: number, comment?: string) {
    return prisma.review.create({
      data: { userId, productId, rating, comment },
    });
  }

  async update(id: string, rating: number, comment?: string) {
    return prisma.review.update({
      where: { id },
      data: { rating, comment },
    });
  }

  async delete(id: string) {
    return prisma.review.delete({ where: { id } });
  }

  async getAverageRating(productId: string) {
    const result = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating,
    };
  }
}

export const reviewsRepository = new ReviewsRepository();
