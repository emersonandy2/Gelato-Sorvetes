"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { verifyToken } from "@/lib/jwt";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// Simple external store for auth state
let authStatus: AuthStatus = "loading";
let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function setAuthStatus(status: AuthStatus) {
  authStatus = status;
  listeners.forEach((l) => l());
}

function getAuthSnapshot() {
  return authStatus;
}

function getServerSnapshot(): AuthStatus {
  return "loading";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useSyncExternalStore(subscribe, getAuthSnapshot, getServerSnapshot);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setAuthStatus("authenticated");
      return;
    }

    async function checkAuth() {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // Verify token using JWT verification (not just base64 decode)
      const payload = await verifyToken(token);
      if (!payload || payload.role !== "admin") {
        localStorage.removeItem("admin-token");
        router.push("/admin/login");
        return;
      }

      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem("admin-token");
        router.push("/admin/login");
        return;
      }

      setAuthStatus("authenticated");
    }

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
