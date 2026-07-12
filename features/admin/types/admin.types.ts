export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface DashboardStats {
  totalProducts: number;
  productsInPromotion: number;
  featuredProducts: number;
  todayOrders: number;
  estimatedRevenue: number;
  lowStockProducts: number;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}
