import { favoritesRepository } from "../repositories/favorite.repository";

export class FavoritesService {
  async toggleFavorite(userId: string, productId: string) {
    const isFavorited = await favoritesRepository.isFavorited(userId, productId);

    if (isFavorited) {
      await favoritesRepository.remove(userId, productId);
      return { favorited: false, message: "Removido dos favoritos" };
    } else {
      await favoritesRepository.add(userId, productId);
      return { favorited: true, message: "Adicionado aos favoritos" };
    }
  }

  async getUserFavorites(userId: string) {
    return favoritesRepository.findByUserId(userId);
  }

  async isFavorited(userId: string, productId: string) {
    return favoritesRepository.isFavorited(userId, productId);
  }
}

export const favoritesService = new FavoritesService();
