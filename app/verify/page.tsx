"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { otpSchema, type OtpInput } from "@/lib/validation/auth.schema";
import { verifyOtpAction, sendOtpAction } from "@/features/auth/actions/auth.actions";
import { useAuthStore } from "@/store/use-auth-store";

function getEmailFromSessionStorage() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("otp-email") || "";
}

export default function VerifyPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email] = useState<string>(getEmailFromSessionStorage);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!email) {
      router.push("/login");
      return;
    }

    // Countdown timer for resend
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, email]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  async function onSubmit(data: OtpInput) {
    setIsLoading(true);

    try {
      const result = await verifyOtpAction(email, data.code);

      if (result.success && result.user && result.token) {
        toast.success(result.message);

        // Store token in localStorage
        localStorage.setItem("auth-token", result.token);

        // Update auth store
        setUser(result.user);

        // Clear email from sessionStorage
        sessionStorage.removeItem("otp-email");

        // Redirect to home
        router.push("/");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao verificar código. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    if (countdown > 0) return;

    setIsResending(true);

    try {
      const result = await sendOtpAction(email);

      if (result.success) {
        toast.success("Novo código enviado!");
        setCountdown(60);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao reenviar código.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Verificar Código</CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificação</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                {...register("code")}
                disabled={isLoading}
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <Button
              variant="ghost"
              onClick={handleResendOtp}
              disabled={countdown > 0 || isResending}
              className="text-sm"
            >
              {isResending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : countdown > 0 ? (
                `Reenviar código em ${countdown}s`
              ) : (
                "Reenviar código"
              )}
            </Button>

            <Link
              href="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Usar outro email
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
