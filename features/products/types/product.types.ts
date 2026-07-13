export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  size?: string;
  ingredients?: string;
  preparationTime?: number;
  stock: number;
  available: boolean;
  featured: boolean;
  promotion: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  customizations: ProductCustomization[];
  reviews?: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface ProductCustomization {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  user?: {
    name?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  sortOrder: number;
  active: boolean;
  _count?: {
    products: number;
  };
}

export interface ProductFilters {
  query?: string;
  category?: string;
  featured?: boolean;
  promotion?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
