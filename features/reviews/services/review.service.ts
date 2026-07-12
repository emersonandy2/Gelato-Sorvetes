import { reviewsRepository } from "../repositories/review.repository";

export class ReviewsService {
  async getProductReviews(productId: string) {
    return reviewsRepository.findByProductId(productId);
  }

  async createReview(userId: string, productId: string, rating: number, comment?: string) {
    // Check if user already reviewed this product
    const existingReview = await reviewsRepository.findByUserAndProduct(userId, productId);

    if (existingReview) {
      // Update existing review
      return reviewsRepository.update(existingReview.id, rating, comment);
    }

    // Create new review
    return reviewsRepository.create(userId, productId, rating, comment);
  }

  async deleteReview(userId: string, reviewId: string) {
    // Find the review to verify ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.userId !== userId) {
      throw new Error("Review not found or unauthorized");
    }

    return reviewsRepository.delete(reviewId);
  }

  async getAverageRating(productId: string) {
    return reviewsRepository.getAverageRating(productId);
  }
}

// Need to import prisma for the deleteReview method
import { prisma } from "@/lib/prisma";

export const reviewsService = new ReviewsService();
