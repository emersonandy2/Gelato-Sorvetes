"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction, isFavoritedAction } from "@/features/favorites/actions/favorite.actions";
import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "sonner";

interface FavoriteButtonProps {
  productId: string;
  initialFavorited?: boolean;
}

export function FavoriteButton({ productId, initialFavorited = false }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      isFavoritedAction(productId).then(setIsFavorited);
    }
  }, [productId, isAuthenticated]);

  async function handleToggle() {
    if (!isAuthenticated) {
      toast.error("Faça login para favoritar");
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleFavoriteAction(productId);
      if ("favorited" in result) {
        setIsFavorited(result.favorited);
        toast.success(result.message);
      }
    } catch {
      toast.error("Erro ao atualizar favorito");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
