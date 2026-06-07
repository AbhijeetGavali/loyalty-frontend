"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Coffee,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  User,
  PlusCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/appContext";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, setToken } = useAuth();
  const toast = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams?.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setToken(response.accessToken);
      toast.success("Welcome back! Redirecting to your dashboard...");
      router.push(redirectTo);
    } catch (err: any) {
      const msg = err.message || "Invalid credentials. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) router.push(redirectTo);
    else {
      const storedToken = localStorage.getItem("token") ?? "";
      if (storedToken?.length > 0) {
        console.warn(
          "Token found in localStorage, setting auth state",
          storedToken,
        );
        setToken(storedToken);
        router.push(redirectTo);
      }
    }
  }, [token]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#0C0A09] select-none transition-colors duration-500">
      {/* SIDEBAR DESIGN PANEL: Visible exclusively on desktop screens */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 bg-gradient-to-b from-[#161210] to-[#0A0807] border-r border-stone-800/60 p-10 flex-col justify-between relative overflow-hidden bg-grain">
        <div className="absolute top-0 left-0 w-full h-full bg-amber-500/[0.01] blur-3xl rounded-full pointer-events-none" />

        {/* Desktop Branding Anchor */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="size-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/20">
              <Coffee className="size-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-stone-100 tracking-tight text-md">
                Regulars<span className="text-amber-400">Club</span>
              </span>
              <p className="text-[10px] text-stone-500 font-medium tracking-wider uppercase -mt-0.5">
                Merchant Ecosystem
              </p>
            </div>
          </div>
        </Link>

        {/* Real-time Telemetry Analytics Box Simulation */}
        <div className="space-y-6 relative z-10 bg-[#0C0A09]/60 border border-stone-800/40 p-5 rounded-2xl backdrop-blur-md shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-stone-300">
              <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
              <span>Active Node: terminal_pune_04</span>
            </div>
            <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="font-mono text-[10px] text-stone-500 space-y-1.5 leading-relaxed">
            <p className="text-emerald-500/90">
              // Real-Time Stamp Monitoring Sync...
            </p>
            <p>→ Receipt validation hash verified securely.</p>
            <p className="text-stone-400">
              → Core customer tier promoted:{" "}
              <span className="text-amber-400 font-bold">Top 10% Regular</span>
            </p>
          </div>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="size-3.5 text-emerald-600" /> Secure operator
          session framework authenticated.
        </div>
      </div>

      {/* WORKING INTERFACE WRAPPER: Handles form layout across both desktop and mobile viewports */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

        {/* MOBILE BRAND SIGNATURE HEADER (Hidden automatically on desktop sizes) */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex lg:hidden flex-col items-center justify-center gap-2 mb-8 relative z-10 animate-fade-in">
            <div className="size-14 rounded-2xl bg-[#14100E] border border-stone-800/80 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/5">
              <Coffee className="size-6 stroke-[2]" />
            </div>
            <div className="text-center">
              <span className="font-black text-2xl tracking-tight text-stone-100">
                Regulars<span className="text-amber-500">Club</span>
              </span>
              <p className="text-[10px] text-stone-500 font-bold tracking-widest uppercase mt-0.5">
                Merchant Center
              </p>
            </div>
          </div>
        </Link>

        {/* Central Core Login Utility Form Block */}
        <Card className="w-full max-w-md border-stone-800/80 bg-[#14100E] shadow-none transition-all duration-300 rounded-3xl overflow-hidden relative z-10">
          <CardHeader className="space-y-2 pt-8 px-8 text-center sm:text-left">
            <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">
              Welcome back
            </CardTitle>
            <CardDescription className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Enter your access credentials to manage your store location
              rewards.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-8 pb-4">
              {/* Dynamic Error Status Box */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-shake">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Address Input Range Area */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold text-stone-300 tracking-wide"
                >
                  Business Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="manager@yourcafe.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  disabled={loading}
                  className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/80 focus-visible:ring-amber-500 text-stone-100 transition-all text-sm placeholder:text-stone-600"
                />
              </div>

              {/* Secret Password Fields Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold text-stone-300 tracking-wide"
                  >
                    Secret Password
                  </Label>
                  {/* Forgot Password Action Trigger */}
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/80 focus-visible:ring-amber-500 text-stone-100 pr-10 transition-all text-sm placeholder:text-stone-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors focus:outline-none"
                    aria-label={
                      showPassword
                        ? "Hide password visual sequence"
                        : "Show password sequence"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            {/* Primary Submit Acceleration Button Box */}
            <CardFooter className="px-8 pb-8 pt-4 flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/5 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin stroke-[3]" />
                    <span>Verifying Store Identity...</span>
                  </span>
                ) : (
                  "Access Merchant Dashboard"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* CORE REDIRECT MATRIX: Alternate Context Navigation Links */}
        <div className="w-full max-w-md mt-6 px-4 py-3.5 rounded-2xl bg-[#14100E]/40 border border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs gap-3 relative z-10 animate-fade-in">
          <div className="flex items-center gap-2 text-stone-400">
            <User className="size-4 text-stone-500" />
            <span>Looking for your stamps?</span>
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <Link
              href="/customer-login"
              className="text-amber-500 hover:text-amber-400 transition-colors"
            >
              Customer Login
            </Link>
            <span className="text-stone-700">|</span>
            <Link
              href="/register-business"
              className="text-stone-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <PlusCircle className="size-3.5" />
              <span>Register Business</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
