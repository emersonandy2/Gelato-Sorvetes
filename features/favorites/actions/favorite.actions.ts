"use server";

import { favoritesService } from "../services/favorite.service";
import { getAuthUser } from "@/lib/auth";

export async function toggleFavoriteAction(productId: string) {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, message: "Faça login para favoritar" };
  }

  return favoritesService.toggleFavorite(user.userId, productId);
}

export async function getUserFavoritesAction() {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, message: "Não autenticado" };
  }

  const favorites = await favoritesService.getUserFavorites(user.userId);
  return { success: true, data: favorites };
}

export async function isFavoritedAction(productId: string) {
  const user = await getAuthUser();
  if (!user) {
    return false;
  }

  return favoritesService.isFavorited(user.userId, productId);
}
