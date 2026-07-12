"use client";

import Link from "next/link";
import { ShoppingCart, Menu, Sun, Moon, Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/store/use-cart-store";
import { useUIStore } from "@/store/use-ui-store";
import { useAuthStore } from "@/store/use-auth-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Cardápio" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const { setCartOpen } = useUIStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
    const id = requestAnimationFrame(() => {
      setMounted(true);
      setCartCount(getItemCount());
    });
    return () => cancelAnimationFrame(id);
  }, [getItemCount]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🍦</span>
          <span className="hidden sm:inline">Gelato & Sorvetes</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
            aria-label={`Carrinho de compras${cartCount > 0 ? ` (${cartCount} itens)` : ""}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center" aria-hidden="true">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Carrinho</span>
          </Button>

          {isAuthenticated && (
            <Link href="/favorites">
              <Button variant="ghost" size="icon" aria-label="Favoritos">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                {user?.name || user?.email?.split("@")[0]}
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-transparent bg-transparent text-sm font-medium transition-colors hover:bg-muted hover:text-foreground md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr />
                {isAuthenticated ? (
                  <Link href="/orders" className="text-lg font-medium">
                    Meus Pedidos
                  </Link>
                ) : (
                  <Link href="/login" className="text-lg font-medium">
                    Entrar
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
