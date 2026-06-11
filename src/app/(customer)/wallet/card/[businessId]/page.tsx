"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Coffee, Gift, Star, Plus, FileText, Loader2, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface LoyaltyCard {
  id: string;
  businessId: string;
  currentStamps: number;
  totalEarned: number;
  rewardRedeemedCount: number;
  rewardAvailable: boolean;
  business?: {
    name: string;
    type?: string;
    location?: string;
    googleReviewUrl?: string;
    loyaltyProgram?: Array<{ stampsRequired: number; rewardTitle: string; rewardDescription?: string }>;
  };
}

interface StoreLocation {
  id: string;
  name: string;
  address: string;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    if (data[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

async function detectNearestLocation(locations: StoreLocation[]): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const geocoded = await Promise.all(
          locations.map(async (loc) => ({
            id: loc.id,
            coords: await geocodeAddress(loc.address),
          })),
        );
        let nearest: string | null = null;
        let minDist = Infinity;
        for (const { id, coords } of geocoded) {
          if (!coords) continue;
          const d = haversineKm(latitude, longitude, coords.lat, coords.lon);
          if (d < minDist) { minDist = d; nearest = id; }
        }
        resolve(nearest);
      },
      () => resolve(null),
      { timeout: 5000 },
    );
  });
}

export default function CardDetailPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [invoiceValue, setInvoiceValue] = useState("");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationResolved, setLocationResolved] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const { data: card, isLoading, isError } = useQuery<LoyaltyCard>({
    queryKey: ["card", businessId],
    queryFn: () => api.get<LoyaltyCard>(`/cards/by-business/${businessId}`),
    enabled: !!businessId,
  });

  const { data: locations = [] } = useQuery<StoreLocation[]>({
    queryKey: ["card-locations", businessId],
    queryFn: () => api.get<StoreLocation[]>(`/cards/by-business/${businessId}/locations`),
    enabled: !!businessId,
  });

  // Poll for pending stamp requests for this business
  const { data: pendingStamps = [] } = useQuery<{ id: string; businessId: string; createdAt: string }[]>({
    queryKey: ["my-pending-stamps"],
    queryFn: () => api.get("/stamp/my-pending"),
    refetchInterval: 10000,
    enabled: !!businessId,
  });
  const pendingForThis = pendingStamps.filter((r) => r.businessId === businessId);

  const stampMutation = useMutation({
    mutationFn: (invoiceNumber: string) =>
      api.post("/stamp/request", {
        businessId,
        invoiceNumber,
        ...(selectedLocationId ? { storeLocationId: selectedLocationId } : {}),
      }),
    onSuccess: () => {
      setInvoiceValue("");
      setInvoiceOpen(false);
      setSelectedLocationId(null);
      setLocationResolved(false);
      queryClient.invalidateQueries({ queryKey: ["card", businessId] });
      queryClient.invalidateQueries({ queryKey: ["my-cards"] });
      toast.success("Stamp requested! Staff will approve shortly.");
      if (card?.business?.googleReviewUrl) setShowReviewPrompt(true);
    },
    onError: (err: Error) => toast.error(err.message || "Failed to request stamp."),
  });

  const redeemMutation = useMutation({
    mutationFn: () => api.post("/reward/redeem", { loyaltyCardId: card?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", businessId] });
      queryClient.invalidateQueries({ queryKey: ["my-cards"] });
      toast.success("Reward claimed! Show this to the staff.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to claim reward."),
  });

  async function handleOpenInvoice() {
    setInvoiceOpen(true);
    if (locations.length === 0 || locationResolved) return;
    setDetectingLocation(true);
    const nearest = await detectNearestLocation(locations);
    setSelectedLocationId(nearest);
    setLocationResolved(true);
    setDetectingLocation(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (isError || !card) {
    return (
      <div className="min-h-screen bg-[#0C0A09] flex flex-col items-center justify-center gap-3 px-4">
        <p className="text-rose-400 text-sm">Card not found.</p>
        <button onClick={() => router.back()} className="text-xs text-stone-400 underline">Go back</button>
      </div>
    );
  }

  const program = card.business?.loyaltyProgram?.[0];
  const stampsRequired = program?.stampsRequired ?? 10;
  const progress = Math.min((card.currentStamps / stampsRequired) * 100, 100);
  const dots = Array.from({ length: stampsRequired });

  return (
    <div className="min-h-screen bg-[#0C0A09] px-4 py-8 max-w-lg mx-auto space-y-6">
      {/* Google Review Prompt */}
      {showReviewPrompt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#14100E] border border-stone-800 rounded-3xl p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="text-4xl">⭐</div>
              <h2 className="text-lg font-black text-stone-50">Enjoying {card.business?.name}?</h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Your stamp is on its way! While you wait — a quick Google review means the world to us. It only takes 30 seconds. 🙏
              </p>
            </div>
            <a
              href={card.business?.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setShowReviewPrompt(false)}
              className="flex items-center justify-center gap-2 w-full h-11 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-2xl transition-colors"
            >
              <Star className="size-4" /> Leave a Review
            </a>
            <button
              onClick={() => setShowReviewPrompt(false)}
              className="w-full text-xs text-stone-600 hover:text-stone-400 transition-colors py-1"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
      {/* Back */}
      <button
        onClick={() => router.replace("/wallet")}
        className="flex items-center gap-2 text-stone-400 hover:text-stone-200 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" /> My Cards
      </button>

      {/* Card */}
      <Card className="border-stone-800 bg-[#14100E] rounded-3xl p-6 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.03] blur-3xl rounded-full pointer-events-none" />

        {/* Business header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
              {card.business?.type || "Loyalty"}
            </span>
            <h1 className="text-xl font-black text-stone-100 mt-1">{card.business?.name}</h1>
            <p className="text-xs text-stone-500">{card.business?.location}</p>
          </div>
          <div className="size-14 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-stone-100">{card.currentStamps}</span>
            <span className="text-[8px] text-stone-600 font-bold uppercase">stamps</span>
          </div>
        </div>

        {/* Stamp dots */}
        <div className="flex flex-wrap gap-2">
          {dots.map((_, i) => (
            <div
              key={i}
              className={`size-9 rounded-xl flex items-center justify-center border transition-all ${
                i < card.currentStamps
                  ? "bg-amber-500 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                  : "bg-stone-900 border-stone-800"
              }`}
            >
              <Coffee className={`size-4 ${i < card.currentStamps ? "text-stone-950" : "text-stone-700"}`} />
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-stone-500">
            <span>{card.currentStamps} of {stampsRequired} stamps</span>
            <span>{card.rewardRedeemedCount} reward{card.rewardRedeemedCount !== 1 ? "s" : ""} redeemed</span>
          </div>
          <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Reward info */}
        {program && (
          <div className="bg-stone-900/60 rounded-2xl p-4 space-y-1.5 border border-stone-800/60">
            <div className="flex items-center gap-2">
              <Gift className="size-3.5 text-amber-400 shrink-0" />
              <p className="text-xs font-bold text-stone-200">{program.rewardTitle}</p>
            </div>
            {program.rewardDescription && (
              <p className="text-[11px] text-stone-500 pl-5">{program.rewardDescription}</p>
            )}
          </div>
        )}

        {/* Pending stamp requests */}
        {pendingForThis.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <Clock className="size-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-amber-300">
                {pendingForThis.length === 1 ? "Stamp request pending" : `${pendingForThis.length} stamp requests pending`}
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">
                Waiting for staff approval. This usually takes a few minutes.
              </p>
            </div>
          </div>
        )}

        {/* Request Stamp */}
        {!card.rewardAvailable && pendingForThis.length === 0 && (
          <div className="space-y-2">
            {!invoiceOpen ? (
              <Button
                onClick={handleOpenInvoice}
                className="w-full h-10 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-sm rounded-2xl flex items-center justify-center gap-2"
              >
                <Plus className="size-4" /> Request Stamp
              </Button>
            ) : (
              <div className="space-y-2">
                {/* Location selector */}
                {locations.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      <MapPin className="size-3" />
                      {detectingLocation ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="size-3 animate-spin" /> Detecting nearest branch…
                        </span>
                      ) : (
                        <span>Branch</span>
                      )}
                    </div>
                    <select
                      value={selectedLocationId ?? ""}
                      onChange={(e) => setSelectedLocationId(e.target.value || null)}
                      className="w-full h-9 px-3 bg-stone-900 border border-stone-700 text-stone-100 text-sm rounded-2xl outline-none focus:border-amber-500/50"
                    >
                      <option value="">— Select branch —</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Invoice input + submit */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-stone-500" />
                    <input
                      type="text"
                      placeholder="Invoice / Bill number"
                      value={invoiceValue}
                      onChange={e => setInvoiceValue(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 bg-stone-900 border border-stone-700 text-stone-100 text-sm rounded-2xl outline-none focus:border-amber-500/50"
                      autoFocus
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (!invoiceValue.trim()) { toast.error("Enter your bill/invoice number."); return; }
                      stampMutation.mutate(invoiceValue.trim());
                    }}
                    disabled={stampMutation.isPending || detectingLocation}
                    className="h-10 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-2xl"
                  >
                    {stampMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Send"}
                  </Button>
                  <button
                    onClick={() => { setInvoiceOpen(false); setInvoiceValue(""); setSelectedLocationId(null); setLocationResolved(false); }}
                    className="h-10 px-3 text-stone-500 hover:text-stone-300 text-sm"
                  >✕</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Claim Reward */}
        {card.rewardAvailable && (
          <Button
            onClick={() => redeemMutation.mutate()}
            disabled={redeemMutation.isPending}
            className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2"
          >
            {redeemMutation.isPending
              ? <Loader2 className="size-4 animate-spin" />
              : <><Star className="size-4" /> Claim Reward</>}
          </Button>
        )}
      </Card>

      {/* Stamp history summary */}
      <div className="text-center text-xs text-stone-600">
        Total stamps earned: {card.totalEarned}
      </div>
    </div>
  );
}
