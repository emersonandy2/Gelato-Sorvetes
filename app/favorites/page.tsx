"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserFavoritesAction } from "@/features/favorites/actions/favorite.actions";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import type { Product } from "@/features/products/types/product.types";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      async function load() {
        const result = await getUserFavoritesAction();
        if (result.success && result.data) {
          setFavorites(
            (result.data as unknown as { product: Product }[]).map((f) => f.product)
          );
        }
        setIsLoading(false);
      }
      load();
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Meus Favoritos</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Você ainda não favoritou nenhum produto
            </p>
            <Link href="/catalog">
              <Button>Ver Cardápio</Button>
            </Link>
          </div>
        ) : (
          <ProductGrid products={favorites} />
        )}
      </main>
      <Footer />
      <CartSheet />
    </div>
  );
}
