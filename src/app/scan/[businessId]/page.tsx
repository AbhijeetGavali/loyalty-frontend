"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Loader2, Coffee } from "lucide-react";

function parseJwt(token: string): { role?: string } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function ScanOnboardingPage() {
  const params = useParams();
  const businessId = params?.businessId as string;
  const toast = useToast();
  const router = useRouter();
  const [status, setStatus] = useState("Identifying café...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId) return;

    // Read auth directly from localStorage — avoids the context hydration race
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!stored) {
      sessionStorage.setItem("onboardingBusinessId", businessId);
      router.replace(`/customer-login?redirect=/scan/${businessId}`);
      return;
    }

    const parsed = parseJwt(stored);
    const role = parsed?.role;

    // Non-customer users (owner/staff) go to dashboard
    if (role && role !== "CUSTOMER") {
      router.replace("/dashboard");
      return;
    }

    const onboard = async () => {
      try {
        setStatus("Creating your loyalty card...");
        await api.post("/cards", { businessId });
        setStatus("You're in! Opening your card...");
        toast.success("Loyalty card created!");
        setTimeout(() => router.replace(`/wallet/card/${businessId}`), 800);
      } catch (err: any) {
        const msg = err.message || "Failed to join loyalty program";
        if (
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("unique")
        ) {
          toast.info("You already have a card here.");
          router.replace(`/wallet/card/${businessId}`);
        } else {
          toast.error(msg);
          setError(msg);
        }
      }
    };

    onboard();
  }, [businessId]); // only businessId — no context deps that cause re-runs during hydration

  return (
    <div className="min-h-screen bg-[#0C0A09] flex flex-col items-center justify-center gap-4 px-4">
      <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
        <Coffee className="size-6 text-amber-400" />
      </div>
      {error ? (
        <div className="text-center space-y-2">
          <p className="text-rose-400 text-sm font-bold">{error}</p>
          <button
            onClick={() => router.replace("/wallet")}
            className="text-xs text-stone-400 underline"
          >
            Go to wallet
          </button>
        </div>
      ) : (
        <>
          <Loader2 className="size-6 animate-spin text-amber-500" />
          <p className="text-stone-400 text-sm font-medium">{status}</p>
        </>
      )}
    </div>
  );
}
