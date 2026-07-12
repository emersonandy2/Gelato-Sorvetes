"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Tag,
  Star,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStatsAction } from "@/features/admin/actions/admin.actions";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/features/admin/types/admin.types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getDashboardStatsAction();
      setStats(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const statCards = stats
    ? [
        {
          title: "Total de Produtos",
          value: stats.totalProducts,
          icon: Package,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          title: "Em Promoção",
          value: stats.productsInPromotion,
          icon: Tag,
          color: "text-red-500",
          bg: "bg-red-500/10",
        },
        {
          title: "Produtos em Destaque",
          value: stats.featuredProducts,
          icon: Star,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        },
        {
          title: "Pedidos Hoje",
          value: stats.todayOrders,
          icon: ShoppingCart,
          color: "text-green-500",
          bg: "bg-green-500/10",
        },
        {
          title: "Receita Estimada",
          value: formatCurrency(stats.estimatedRevenue),
          icon: DollarSign,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          title: "Estoque Baixo",
          value: stats.lowStockProducts,
          icon: AlertTriangle,
          color: "text-orange-500",
          bg: "bg-orange-500/10",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${card.bg}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
