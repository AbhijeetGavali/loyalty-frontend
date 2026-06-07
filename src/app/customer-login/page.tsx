"use client";

import { useState, useEffect, Suspense } from "react";
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
  Smartphone,
  Sparkles,
  Loader2,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Store,
} from "lucide-react";
import { useAuth } from "@/lib/appContext";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

function CustomerLoginPage() {
  const [step, setStep] = useState<"phone" | "pin">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setToken } = useAuth();
  const toast = useToast();
  const searchParams = useSearchParams();

  const redirectTo = searchParams?.get("redirect") || "/wallet";
  const router = useRouter();

  // Step 1: Validate phone layout and advance seamlessly
  const handleProceedToPin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10) return;

    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStep("pin");
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Authenticate or Instantly Register Node on Submission
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode || pinCode.length !== 6) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/c/login", {
        phone: phoneNumber.trim(),
        pin: pinCode.trim(),
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
      }
      setToken(response.accessToken);
      toast.success("Welcome! Opening your wallet...");
      router.push(redirectTo);
    } catch (err) {
      const msg = (err as Error).message || "Incorrect PIN. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Only redirect on mount if already logged in — never re-run after login attempt
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      router.replace(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0A09] text-stone-100 flex flex-col justify-center items-center p-4 bg-grain">
      {/* BRAND VISUAL ACCENT */}
      <Link href="/" className="flex items-center gap-2 group mb-6">
        <div className="flex flex-col items-center justify-center gap-1.5 animate-fade-in">
          <div className="size-11 rounded-2xl bg-[#14100E] border border-stone-850 flex items-center justify-center text-amber-500 shadow-xl">
            <Sparkles className="size-5 text-amber-400 fill-amber-400/10" />
          </div>
          <span className="font-black text-xl tracking-tight text-white mt-1">
            Regulars<span className="text-amber-500 font-medium">Club</span>
          </span>
        </div>
      </Link>

      <Card className="w-full max-w-sm border-stone-900 bg-[#14100E] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.01] blur-3xl rounded-full pointer-events-none" />

        {step === "phone" ? (
          /* ========================================================================
             PHASE 1: PHONE CAPTURE (DEDICATED FOR BOTH LOGIN & SIGN UP)
             ======================================================================== */
          <form onSubmit={handleProceedToPin}>
            <CardHeader className="text-center space-y-1.5 pt-7 px-6 mb-4">
              <CardTitle className="text-xl font-black tracking-tight text-stone-50">
                Join or Sign In
              </CardTitle>
              <CardDescription className="text-stone-400 text-xs leading-relaxed max-w-[290px] mx-auto">
                Enter your mobile number to instantly claim your digital stamp
                cards and view your reward points.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-2 px-6">
              {error && (
                <div className="text-xs text-rose-400 font-semibold bg-rose-500/[0.02] border border-rose-500/20 p-3 rounded-xl text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-[10px] font-black text-stone-400 uppercase tracking-widest font-mono"
                >
                  Mobile Number
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-500 font-mono">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    pattern="[0-9]{10}"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    disabled={loading}
                    required
                    className="h-12 pl-14 pr-4 rounded-xl bg-[#0C0A09] border-stone-850 text-stone-50 focus-visible:ring-amber-500 transition-all placeholder:text-stone-700 text-sm font-bold tracking-wide"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 pb-7 flex flex-col space-y-4 px-6">
              <Button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-20 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/5"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin stroke-[3]" />
                ) : (
                  <Smartphone className="size-4 stroke-[2.5]" />
                )}
                <span>Continue</span>
              </Button>

              <span className="text-[11px] text-stone-500 font-medium text-center leading-normal">
                No prior account needed, new numbers are registered
                automatically.
              </span>
            </CardFooter>
          </form>
        ) : (
          /* ========================================================================
             PHASE 2: SECURE MULTI-PURPOSE PASSPHRASE PIN FIELD
             ======================================================================== */
          <form onSubmit={handleVerifyPin}>
            <CardHeader className="space-y-1.5 pt-6 px-6 mb-3">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-stone-500 hover:text-stone-300 transition-colors uppercase tracking-wider font-mono bg-stone-900/40 px-2.5 py-1 rounded-md border border-stone-850 w-fit"
              >
                <ArrowLeft className="size-3" /> Back
              </button>
              <div className="text-center pt-2">
                <CardTitle className="text-xl font-black tracking-tight text-stone-50">
                  Secure Your Pass
                </CardTitle>
                <CardDescription className="text-stone-400 text-xs leading-relaxed mt-1">
                  Enter your PIN to log in, or choose a new 6-digit PIN if this
                  is your first time checking in.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-2 px-6">
              {error && (
                <div className="text-xs text-rose-400 font-semibold bg-rose-500/[0.02] border border-rose-500/20 p-3 rounded-xl text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="pin"
                  className="text-[10px] font-black text-stone-400 text-center block uppercase tracking-widest font-mono"
                >
                  6-Digit Personal PIN
                </Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="••••••"
                  value={pinCode}
                  onChange={(e) =>
                    setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  disabled={loading}
                  required
                  className="h-12 rounded-xl bg-[#0C0A09] border-stone-850 text-center tracking-[0.4em] font-mono text-xl font-black text-amber-400 focus-visible:ring-amber-500 transition-all placeholder:text-stone-850"
                />
              </div>
            </CardContent>

            <CardFooter className="pt-3 pb-7 flex flex-col space-y-4 px-6">
              <Button
                type="submit"
                disabled={loading || pinCode.length !== 6}
                className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-20 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/5"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin stroke-[3]" />
                ) : (
                  <Lock className="size-4 stroke-[2]" />
                )}
                <span>Open Digital Wallet</span>
              </Button>

              <div className="text-center">
                <Link
                  href="/support/forgot-pin"
                  className="text-[11px] text-stone-500 hover:text-stone-400 transition-colors font-medium"
                >
                  Forgot your wallet PIN?
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>

      {/* RETAIL CAFE FOOTER MODULE CONTAINER */}
      <div className="w-full max-w-sm mt-5 px-5 py-4 rounded-2xl bg-[#14100E]/30 border border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs gap-3.5">
        <div className="flex items-center gap-2 text-stone-400 font-medium">
          <Store className="size-4 text-stone-500" />
          <span>Own a retail shop or cafe?</span>
        </div>
        <div className="flex items-center gap-3 font-bold shrink-0">
          <Link
            href="/login"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            Merchant Terminal
          </Link>
          <span className="text-stone-800">|</span>
          <Link
            href="/register-business"
            className="text-stone-300 hover:text-white transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      <span className="text-[10px] text-stone-600 font-medium mt-6 flex items-center gap-1.5 tracking-wide">
        <ShieldCheck className="size-3.5 text-stone-600" /> Secure banking-grade
        wallet encryption active.
      </span>
    </div>
  );
}

export default function CustomerLoginPageWrapper() {
  return (
    <Suspense>
      <CustomerLoginPage />
    </Suspense>
  );
}
