"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category } from "@/features/products/types/product.types";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentFeatured = searchParams.get("featured") || "";
  const currentPromotion = searchParams.get("promotion") || "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/catalog?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParam("query", search);
  }

  function clearFilters() {
    setSearch("");
    router.push("/catalog");
  }

  const hasActiveFilters =
    currentCategory ||
    !!searchParams.get("query") ||
    currentSort !== "newest" ||
    currentMinPrice ||
    currentMaxPrice ||
    currentFeatured ||
    currentPromotion;

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </form>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <Select
          value={currentCategory || "all"}
          onValueChange={(value: string | null) =>
            updateParam("category", value && value !== "all" ? value : "")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={currentSort}
          onValueChange={(value: string | null) => updateParam("sort", value || "newest")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recentes</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
            <SelectItem value="name-asc">Nome A-Z</SelectItem>
            <SelectItem value="name-desc">Nome Z-A</SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile Filters */}
        <Sheet>
          <SheetTrigger className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg md:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Faixa de Preço</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={currentMinPrice}
                    onChange={(e) => updateParam("minPrice", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={currentMaxPrice}
                    onChange={(e) => updateParam("maxPrice", e.target.value)}
                  />
                </div>
              </div>

              {/* Featured */}
              <div className="space-y-2">
                <Label>Exibir</Label>
                <Select
                  value={currentFeatured || "all"}
                  onValueChange={(value: string | null) =>
                    updateParam("featured", value && value !== "all" ? value : "")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Destaques</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Promotion */}
              <div className="space-y-2">
                <Label>Promoção</Label>
                <Select
                  value={currentPromotion || "all"}
                  onValueChange={(value: string | null) =>
                    updateParam("promotion", value && value !== "all" ? value : "")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Em promoção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {(currentCategory || searchParams.get("query") || currentMinPrice || currentMaxPrice || currentFeatured || currentPromotion) && (
        <div className="flex flex-wrap gap-2">
          {searchParams.get("query") && (
            <Badge variant="secondary">
              Busca: {searchParams.get("query") || ""}
              <button
                onClick={() => updateParam("query", "")}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentCategory && (
            <Badge variant="secondary">
              {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
              <button
                onClick={() => updateParam("category", "")}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentMinPrice && (
            <Badge variant="secondary">
              Mín: R${currentMinPrice}
              <button
                onClick={() => updateParam("minPrice", "")}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentMaxPrice && (
            <Badge variant="secondary">
              Máx: R${currentMaxPrice}
              <button
                onClick={() => updateParam("maxPrice", "")}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFeatured && (
            <Badge variant="secondary">
              Destaques
              <button
                onClick={() => updateParam("featured", "")}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentPromotion && (
            <Badge variant="secondary">
              Em promoção
              <button
                onClick={() => updateParam("promotion", "")}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-sm font-medium leading-none" {...props}>
      {children}
    </label>
  );
}
