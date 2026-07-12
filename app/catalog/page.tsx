"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Pagination } from "@/components/shared/pagination";
import { Skeleton } from "@/components/ui/skeleton";

import { getProductsAction } from "@/features/products/actions/product.actions";
import { getCategoriesAction } from "@/features/categories/actions/category.actions";
import type { Product, Category } from "@/features/products/types/product.types";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      const filterParams = new URLSearchParams();

      const query = searchParams.get("query") || "";
      const category = searchParams.get("category") || "";
      const sort = searchParams.get("sort") || "newest";
      const page = searchParams.get("page") || "1";
      const featured = searchParams.get("featured") || "";
      const promotion = searchParams.get("promotion") || "";

      if (query) filterParams.set("query", query);
      if (category) filterParams.set("category", category);
      if (sort) filterParams.set("sort", sort);
      if (page) filterParams.set("page", page);
      if (featured) filterParams.set("featured", featured);
      if (promotion) filterParams.set("promotion", promotion);

      const [productsResult, categoriesResult] = await Promise.all([
        getProductsAction(Object.fromEntries(filterParams)),
        getCategoriesAction(),
      ]);

      setProducts(productsResult.products);
      setTotalPages(productsResult.totalPages);
      setCurrentPage(productsResult.page);
      setCategories(categoriesResult as unknown as Category[]);
      setIsLoading(false);
    }

    load();
  }, [searchParams]);

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cardápio</h1>
          <p className="text-muted-foreground">
            Confira nossos deliciosos sabores
          </p>
        </div>

        <div className="space-y-6">
          <ProductFilters categories={categories} />

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      <Footer />
      <CartSheet />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            <Skeleton className="h-10 w-40 mb-2" />
            <Skeleton className="h-5 w-60 mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </main>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
