"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Link2, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/appContext";
import { useToast } from "@/components/ui/toast";

function AffiliateLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, setToken } = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      const stored = localStorage.getItem("token");
      if (stored) {
        setToken(stored);
        router.replace("/affiliate");
      }
    } else {
      router.replace("/affiliate");
    }
  }, [token, router, setToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post<{ accessToken: string; refreshToken: string }>(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
      );
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      setToken(res.accessToken);
      toast.success("Welcome back!");
      router.push("/affiliate");
    } catch (err) {
      const msg = (err as Error).message || "Invalid credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-1">
          <div className="flex flex-col items-center justify-center mb-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <span className="text-xl font-black text-white">
                Regulars<span className="text-amber-400">Club</span>
              </span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Link2 className="size-3" /> Affiliate Portal
            </div>
          </div>
          <h1 className="text-2xl font-black text-stone-100 pt-2">
            Sign in to your affiliate account
          </h1>
          <p className="text-xs text-stone-500">
            Access your referral dashboard and earnings
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#14100E] border border-stone-800 rounded-2xl p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Email
            </Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-stone-900 border-stone-800 text-stone-100 text-sm rounded-xl h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-stone-900 border-stone-800 text-stone-100 text-sm rounded-xl h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
              <AlertCircle className="size-3.5 shrink-0" /> {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-xs text-stone-600">
          Not an affiliate yet?{" "}
          <Link
            href="/affiliate-program#apply"
            className="text-amber-400 hover:underline font-semibold"
          >
            Apply here
          </Link>
        </p>

        <p className="text-center text-xs text-stone-700">
          Business owner?{" "}
          <Link href="/login" className="text-stone-500 hover:text-stone-300">
            Sign in to merchant portal →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AffiliateLoginPage() {
  return (
    <Suspense>
      <AffiliateLoginForm />
    </Suspense>
  );
}
