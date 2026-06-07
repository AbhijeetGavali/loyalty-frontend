"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  MailCheck,
  RefreshCw,
  User,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const router = useRouter();
  const toast = useToast();

  // Handle countdown timers for secure token re-dispatch loops
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      // Replace with your actual password recovery endpoint
      await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setIsSubmitted(true);
      setResendCountdown(60); // Protect network line headers for 60 seconds
      toast.success("Reset link sent — check your email");
    } catch (err: any) {
      console.error("Password recovery failure point:", err);
      const msg = err.message || "Could not process recovery. Please verify your administrative email address.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#0C0A09] select-none transition-colors duration-500">
      {/* SIDEBAR DESIGN PANEL: Visible exclusively on desktop screens */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 bg-gradient-to-b from-[#161210] to-[#0A0807] border-r border-stone-800/60 p-10 flex-col justify-between relative overflow-hidden bg-grain">
        <div className="absolute top-0 left-0 w-full h-full bg-amber-500/[0.01] blur-3xl rounded-full pointer-events-none" />

        {/* Desktop Branding Anchor */}
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

        {/* Real-time Telemetry Analytics Box Simulation */}
        <div className="space-y-6 relative z-10 bg-[#0C0A09]/60 border border-stone-800/40 p-5 rounded-2xl backdrop-blur-md shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-stone-300">
              <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
              <span>Security Hub Node // recovery_sec</span>
            </div>
          </div>
          <p className="font-mono text-[10px] text-stone-500 leading-relaxed">
            Automated credential override loops are audited under secure
            merchant provisioning protocols.
          </p>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="size-3.5 text-emerald-600" /> Secure operator
          session framework authenticated.
        </div>
      </div>

      {/* WORKING INTERFACE WRAPPER */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

        {/* MOBILE BRAND SIGNATURE HEADER */}
        <div className="flex lg:hidden flex-col items-center justify-center gap-2 mb-8 relative z-10 animate-fade-in">
          <div className="size-14 rounded-2xl bg-[#14100E] border border-stone-800/80 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/5">
            <Coffee className="size-6 stroke-[2]" />
          </div>
          <div className="text-center">
            <span className="font-black text-2xl tracking-tight text-stone-100">
              Regulars<span className="text-amber-500">Club</span>
            </span>
          </div>
        </div>

        {/* Central Core Card Frame */}
        <Card className="w-full max-w-md border-stone-800/80 bg-[#14100E] shadow-none transition-all duration-300 rounded-3xl overflow-hidden relative z-10">
          {!isSubmitted ? (
            /* ACTIVE FORM STATE: COLLECT ADDRESS */
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-2 pt-8 px-8 text-center sm:text-left">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors mb-2 font-medium"
                >
                  <ArrowLeft className="size-3.5" /> Back to Login
                </Link>
                <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                  Provide your business email link. We'll transmit secure
                  onboarding instructions directly to your node.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-8 pb-4">
                {error && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-shake mt-3">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5 mt-6">
                  <Label
                    htmlFor="email"
                    className="text-xs font-bold text-stone-300 tracking-wide"
                  >
                    Account Business Email
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
              </CardContent>

              <CardFooter className="px-8 pb-8 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/5 active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin stroke-[3]" />
                      <span>Transmitting Link...</span>
                    </span>
                  ) : (
                    "Send Recovery Instructions"
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            /* SUCCESS COMPLETION STATE */
            <div className="p-8 text-center animate-fade-in flex flex-col items-center">
              <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 shadow-inner">
                <MailCheck className="size-8 stroke-[1.5]" />
              </div>

              <h3 className="text-xl font-black text-stone-50 tracking-tight mb-2">
                Transmission Completed
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm px-2 leading-relaxed mb-6">
                An recovery anchor link was successfully dispatched to{" "}
                <span className="text-amber-400 font-mono text-xs break-all">
                  {email}
                </span>
                . Please view your inbox folder.
              </p>

              <div className="w-full space-y-4">
                {resendCountdown > 0 ? (
                  <p className="text-[11px] text-stone-500 py-2">
                    Request new recovery email link in{" "}
                    <span className="text-stone-300 font-bold">
                      {resendCountdown}s
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-11 bg-stone-900 hover:bg-stone-800/80 text-stone-200 border border-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 justify-center"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>Resend Instructions Link</span>
                  </button>
                )}

                <Link
                  href="/login"
                  className="block text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors pt-2"
                >
                  Return to Store Login Screen
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* CORE REDIRECT MATRIX */}
        <div className="w-full max-w-md mt-6 px-4 py-3.5 rounded-2xl bg-[#14100E]/40 border border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs gap-3 relative z-10 animate-fade-in">
          <div className="flex items-center gap-2 text-stone-400">
            <User className="size-4 text-stone-500" />
            <span>Looking for customer points?</span>
          </div>
          <Link
            href="/customer-login"
            className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
          >
            Customer Loyalty Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
