"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Minus, Plus, Star, Clock, Package } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getProductBySlugAction,
  getRelatedProductsAction,
} from "@/features/products/actions/product.actions";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/features/products/types/product.types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setIsLoading(true);

      const data = await getProductBySlugAction(slug);
      if (!data) {
        setIsLoading(false);
        return;
      }

      setProduct(data as unknown as Product);

      if (data.categoryId && data.id) {
        const related = await getRelatedProductsAction(data.categoryId, data.id, 4);
        setRelatedProducts(related as unknown as Product[]);
      }

      setIsLoading(false);
    }

    load();
  }, [slug]);

  function handleAddToCart() {
    if (!product) return;
    const imageUrl = product.images?.[0]?.url || "/placeholder-product.jpg";
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: imageUrl,
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button onClick={() => router.push("/catalog")}>Voltar ao Cardápio</Button>
        </main>
      </div>
    );
  }

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/catalog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Cardápio
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.images?.[selectedImage]?.url || "/placeholder-product.jpg"}
                alt={product.images?.[selectedImage]?.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.promotion && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-base px-3 py-1">
                  Promoção
                </Badge>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category?.name}
              </Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {averageRating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ({product.reviews?.length || 0} avaliações)
                  </span>
                </div>
              )}
            </div>

            <p className="text-3xl font-bold text-primary">
              {formatCurrency(Number(product.price))}
            </p>

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {product.size && (
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Tamanho: {product.size}
                </div>
              )}
              {product.preparationTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Preparo: {product.preparationTime} min
                </div>
              )}
              {product.stock > 0 && product.stock <= 10 && (
                <Badge variant="outline" className="text-amber-600">
                  Últimas {product.stock} unidades
                </Badge>
              )}
            </div>

            {product.ingredients && (
              <div>
                <h3 className="font-semibold mb-1">Ingredientes</h3>
                <p className="text-sm text-muted-foreground">{product.ingredients}</p>
              </div>
            )}

            <Separator />

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantidade:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.available || product.stock <= 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.available && product.stock > 0
                  ? `Adicionar ao Carrinho - ${formatCurrency(Number(product.price) * quantity)}`
                  : "Indisponível"}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {review.user?.name || "Anônimo"}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <CartSheet />
    </div>
  );
}
