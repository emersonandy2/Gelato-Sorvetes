"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Clock, MessageCircle } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getFeaturedProductsAction,
  getPromotionProductsAction,
} from "@/features/products/actions/product.actions";
import { getCategoriesAction } from "@/features/categories/actions/category.actions";
import type { Product, Category } from "@/features/products/types/product.types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [featured, promotions, cats] = await Promise.all([
        getFeaturedProductsAction(8),
        getPromotionProductsAction(8),
        getCategoriesAction(),
      ]);
      setFeaturedProducts(featured as unknown as Product[]);
      setPromotionProducts(promotions as unknown as Product[]);
      setCategories(cats as unknown as Category[]);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Arte e Sabor
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Os Melhores
              <br />
              Sorvetes Artesanais
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
              Feitos com ingredientes naturais e muito amor. Descubra sabores únicos que vão conquistar seu paladar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button size="lg" className="bg-white text-rose-600 hover:bg-white/90">
                  Ver Cardápio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "558896357773"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Nossas Categorias</h2>
            <p className="text-muted-foreground">Escolha seu favorito</p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalog?category=${category.slug}`}
                >
                  <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">
                        {category.icon || "📦"}
                      </div>
                      <h3 className="font-medium">{category.name}</h3>
                      {category._count && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {category._count.products} itens
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Destaques</h2>
              <p className="text-muted-foreground">Os favoritos dos nossos clientes</p>
            </div>
            <Link href="/catalog?featured=true">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      {/* Promotions */}
      {promotionProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge className="mb-2 bg-red-500 hover:bg-red-600">Ofertas</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Promoções do Dia</h2>
                <p className="text-muted-foreground">Aproveite nossos descontos especiais</p>
              </div>
              <Link href="/catalog?promotion=true">
                <Button variant="outline">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={promotionProducts} />
          </div>
        </section>
      )}

      {/* About / Info */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Localização</h3>
                <p className="text-sm text-muted-foreground">
                  Rua Example, 123
                  <br />
                  Centro - São Paulo, SP
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Horário</h3>
                <p className="text-sm text-muted-foreground">
                  Seg - Sex: 09:00 - 22:00
                  <br />
                  Sáb - Dom: 10:00 - 23:00
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Contato</h3>
                <p className="text-sm text-muted-foreground">
                  (11) 99999-9999
                  <br />
                  contato@gelato.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "558896357773"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <Footer />
      <CartSheet />
    </div>
  );
}
