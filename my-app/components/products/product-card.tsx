"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import type { Product } from "@/features/products/types/product.types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const imageUrl = product.images?.[0]?.url || "/placeholder-product.jpg";
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: imageUrl,
    });
  }

  return (
    <Link href={`/catalog/${product.slug}`} aria-label={`Ver detalhes de ${product.name}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
          />
          {product.promotion && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Promoção
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
              Destaque
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {product.category?.name}
              </Badge>
              {averageRating > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {averageRating.toFixed(1)}
                </div>
              )}
            </div>
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            )}
            <div className="flex items-center justify-between pt-2">
              <p className="text-lg font-bold text-primary">
                {formatCurrency(Number(product.price))}
              </p>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 shrink-0"
                onClick={handleAddToCart}
                disabled={!product.available || product.stock <= 0}
                aria-label={`Adicionar ${product.name} ao carrinho`}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
            {!product.available && (
              <p className="text-xs text-destructive">Indisponível</p>
            )}
            {product.available && product.stock <= 5 && product.stock > 0 && (
              <p className="text-xs text-amber-600">
                Últimas {product.stock} unidades!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
