"use server";

import { reviewsService } from "../services/review.service";
import { getAuthUser } from "@/lib/auth";

export async function getProductReviewsAction(productId: string) {
  return reviewsService.getProductReviews(productId);
}

export async function createReviewAction(productId: string, rating: number, comment?: string) {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, message: "Faça login para avaliar" };
  }

  try {
    await reviewsService.createReview(user.userId, productId, rating, comment);
    return { success: true, message: "Avaliação enviada com sucesso!" };
  } catch {
    return { success: false, message: "Erro ao enviar avaliação" };
  }
}

export async function deleteReviewAction(reviewId: string) {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, message: "Não autenticado" };
  }

  try {
    await reviewsService.deleteReview(user.userId, reviewId);
    return { success: true, message: "Avaliação excluída" };
  } catch {
    return { success: false, message: "Erro ao excluir avaliação" };
  }
}

export async function getAverageRatingAction(productId: string) {
  return reviewsService.getAverageRating(productId);
}
