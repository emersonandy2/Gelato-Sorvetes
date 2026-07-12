"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { getSessionAction } from "@/features/auth/actions/auth.actions";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    async function loadSession() {
      const token = localStorage.getItem("auth-token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const session = await getSessionAction(token);

        if (session) {
          setUser({
            id: session.userId,
            email: session.email,
            name: session.name,
            phone: session.phone,
          });
        } else {
          localStorage.removeItem("auth-token");
          setUser(null);
        }
      } catch {
        localStorage.removeItem("auth-token");
        setUser(null);
      }
    }

    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
