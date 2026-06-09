"use client";

import { useEffect, useState, Suspense } from "react";
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
import { CustomSelect } from "@/components/ui/select";
import {
  Coffee,
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Store,
  MapPin,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/appContext";
import { useToast } from "@/components/ui/toast";

type Step = 1 | 2 | 3;

// Structured datasets for your custom select fields
const STORE_CLASSIFICATIONS = [
  { value: "Coffee Shop", label: "Coffee Shop / Roastery" },
  { value: "Bakery", label: "Boutique Bakery" },
  { value: "Restaurant", label: "Bistro & Eatery" },
  { value: "Salon", label: "Salon / Wellness Studio" },
  { value: "Retail", label: "Boutique Retailer" },
];

const STAMP_MATRIX_OPTIONS = [
  { value: "5", label: "5 Stamps (High Velocity Loop)" },
  { value: "8", label: "8 Stamps (Standard Hospitality Block)" },
  { value: "10", label: "10 Stamps (Premium Reward Tier)" },
  { value: "12", label: "12 Stamps (Enterprise Extended Loop)" },
];

function RegisterBusinessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams?.get("plan") || "BASIC";
  const redirectTo = searchParams?.get("redirect") || "/dashboard";
  const affiliateCode = searchParams?.get("ref") || (typeof window !== "undefined" ? localStorage.getItem("affiliateCode") : null);

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State Architecture
  const [businessName, setBusinessName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stampRequirement, setStampRequirement] = useState("10");
  const { token, setToken } = useAuth();
  const toast = useToast();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === 1 && (!businessName || !storeType)) {
      setError("Please fill out all storefront metrics.");
      return;
    }
    if (step === 2 && !location) {
      setError("Business location is required.");
      return;
    }
    setStep((prev) => (prev + 1) as Step);
  };

  const handleBackStep = () => {
    setError("");
    setStep((prev) => (prev - 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Security clearance mismatch: Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/register", {
        businessName,
        storeType,
        location,
        email: email.trim().toLowerCase(),
        password,
        targetStamps: Number(stampRequirement),
        starterPlanCode: plan,
        ...(affiliateCode ? { affiliateCode } : {}),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
      }
      setToken(response.accessToken);

      toast.success("Business registered! Welcome to RegularsClub.");
      router.push(redirectTo);
    } catch (err) {
      const msg = (err as Error).message || "Failed to register. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Persist affiliate referral code from URL to localStorage
  useEffect(() => {
    const refParam = searchParams?.get("ref");
    if (refParam && typeof window !== "undefined") {
      localStorage.setItem("affiliateCode", refParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (token) router.push(redirectTo);
    else {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (storedToken) {
        setToken(storedToken);
        router.push(redirectTo);
      }
    }
  }, [token, redirectTo, router, setToken]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#0C0A09] select-none transition-colors duration-500">
      {/* LEFT DESIGN PANEL: LIVE PREVIEW MATRIX CLIP */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 bg-gradient-to-b from-[#161210] to-[#0A0807] border-r border-stone-800/60 p-10 flex-col justify-between relative overflow-hidden bg-grain">
        <div className="absolute top-0 left-0 w-full h-full bg-amber-500/[0.01] blur-3xl rounded-full pointer-events-none" />
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
                Merchant Node Config
              </p>
            </div>
          </div>
        </Link>

        <div className="relative z-10 space-y-6">
          <p className="text-[11px] font-bold tracking-widest text-stone-500 uppercase">
            Live Ecosystem Preview
          </p>

          <div className="w-full bg-[#14100E] border border-stone-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-amber-500/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] blur-xl rounded-full" />

            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  {storeType || "Store Type"}
                </span>
                <h4 className="text-lg font-black text-stone-100 tracking-tight transition-all truncate max-w-[180px]">
                  {businessName || "Your Brand Name"}
                </h4>
                <p className="text-xs text-stone-500 flex items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  <span className="truncate max-w-[150px]">
                    {location || "Store Location"}
                  </span>
                </p>
              </div>
              <div className="size-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 font-mono text-xs font-bold">
                0/{stampRequirement}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-xl border border-dashed border-stone-800 bg-[#0C0A09] flex items-center justify-center transition-all duration-300 group-hover:bg-[#110D0B]"
                >
                  <Coffee className="size-3.5 text-stone-700/60 stroke-[1.5]" />
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-900 flex justify-between items-center text-[10px] text-stone-500">
              <span>Customer Loyalty Node</span>
              <Sparkles className="size-3 text-amber-500/40 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="size-3.5 text-emerald-600" /> Distributed
          network registry sandbox active.
        </div>
      </div>

      {/* RIGHT WORKSPACE ASPECT */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/[0.01] blur-[120px] rounded-full pointer-events-none" />

        {/* STEPPER TRAIL */}
        <div className="w-full max-w-md mx-auto mb-8 flex items-center justify-between px-2 relative z-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  step === s
                    ? "bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/20 scale-110"
                    : step > s
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-stone-900 text-stone-600 border border-stone-800"
                }`}
              >
                {step > s ? (
                  <CheckCircle2 className="size-4 stroke-[2.5]" />
                ) : (
                  s
                )}
              </div>
              {s !== 3 && (
                <div
                  className={`h-[2px] flex-1 mx-3 transition-all duration-500 ${
                    step > s ? "bg-emerald-500/30" : "bg-stone-900"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="w-full max-w-md border-stone-800/80 bg-[#14100E] shadow-none rounded-3xl overflow-hidden relative z-10 transition-all duration-300">
          <CardHeader className="space-y-1.5 pt-8 px-8 text-center sm:text-left">
            <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">
              {step === 1 && "Storefront Metrics"}
              {step === 2 && "Ecosystem Setup"}
              {step === 3 && "Security Layer"}
            </CardTitle>
            <CardDescription className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              {step === 1 &&
                "Let's establish your physical storefront profile signature."}
              {step === 2 &&
                "Define loyalty card logic targets for your regulars."}
              {step === 3 &&
                "Deploy administrative login properties to clear terminal entry."}
            </CardDescription>
          </CardHeader>

          <form onSubmit={step === 3 ? handleSubmit : handleNextStep}>
            <CardContent className="space-y-4 px-8 pb-4">
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-shake">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: CORE STORE IDENTIFICATION */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="businessName"
                      className="text-xs font-bold text-stone-300 tracking-wide"
                    >
                      Brand / Business Name
                    </Label>
                    <div className="relative">
                      <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
                      <Input
                        id="businessName"
                        placeholder="The Daily Grind Cafe"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        className="h-11 pl-10 rounded-xl bg-[#0C0A09] border-stone-800/80 focus-visible:ring-amber-500 text-stone-100 placeholder:text-stone-600"
                      />
                    </div>
                  </div>

                  {/* Clean custom select mapping */}
                  <CustomSelect
                    label="Storefront Classification"
                    placeholder="Select business model"
                    options={STORE_CLASSIFICATIONS}
                    value={storeType}
                    onValueChange={(val) => setStoreType(val)}
                  />
                </div>
              )}

              {/* STEP 2: OPERATIONAL TARGET CONFIGS */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="location"
                      className="text-xs font-bold text-stone-300 tracking-wide"
                    >
                      Primary Store Location / Branch
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
                      <Input
                        id="location"
                        placeholder="Koregaon Park, Pune"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="h-11 pl-10 rounded-xl bg-[#0C0A09] border-stone-800/80 focus-visible:ring-amber-500 text-stone-100 placeholder:text-stone-600"
                      />
                    </div>
                  </div>

                  {/* Clean custom select mapping */}
                  <CustomSelect
                    label="Stamp Matrix Size (Target Caps)"
                    placeholder="Select target loop"
                    options={STAMP_MATRIX_OPTIONS}
                    value={stampRequirement}
                    onValueChange={(val) => setStampRequirement(val)}
                  />
                </div>
              )}

              {/* STEP 3: ADMINISTRATIVE KEYS */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold text-stone-300 tracking-wide"
                    >
                      Admin Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hq@yourbrand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/80 focus-visible:ring-amber-500 text-stone-100 placeholder:text-stone-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold text-stone-300 tracking-wide"
                    >
                      Secure Password Token
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/80 focus-visible:ring-amber-500 text-stone-100 placeholder:text-stone-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs font-bold text-stone-300 tracking-wide"
                    >
                      Confirm Password Matrix
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/80 focus-visible:ring-amber-500 text-stone-100 placeholder:text-stone-600"
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="px-8 pb-8 pt-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between w-full gap-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackStep}
                    disabled={loading}
                    className="h-11 px-5 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900 rounded-xl font-bold transition-all text-xs"
                  >
                    <ArrowLeft className="size-4 mr-1" /> Back
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/5 active:scale-[0.98] flex-1 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin stroke-[3]" />
                      <span>Provisioning Vault...</span>
                    </>
                  ) : step === 3 ? (
                    <>
                      <span>Deploy System Workspace</span>
                      <ShieldCheck className="size-4 stroke-[2]" />
                    </>
                  ) : (
                    <>
                      <span>Continue Onboarding</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="text-xs text-stone-500 mt-6 relative z-10 animate-fade-in">
          Already handling storefront nodes?{" "}
          <Link
            href="/login"
            className="text-amber-500 font-bold hover:text-amber-400 transition-colors"
          >
            Merchant Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterBusinessPageWrapper() {
  return (
    <Suspense>
      <RegisterBusinessPage />
    </Suspense>
  );
}
