"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function OurRegularsPage() {
  const [search, setSearch] = useState("");

  interface Customer {
    id: string; firstName: string; lastName: string; email: string | null; phone?: string | null;
    totalStamps: number; activeStamps: number; targetStamps?: number;
    rewardAvailable: boolean; rewardRedeemedCount: number;
  }

  const { data: customers = [], isLoading, isError } = useQuery<Customer[]>({
    queryKey: ["business-customers"],
    queryFn: () => api.get<Customer[]>("/business/customers"),
  });

  const filtered = customers.filter((c) => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase());
  });

  const getTierLabel = (total: number) => {
    if (total >= 100) return { label: "VIP", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    if (total >= 20) return { label: "Trusted", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" };
    return { label: "New", color: "text-stone-400 bg-stone-800 border-stone-700" };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Our Regulars</h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            {customers.length} customer{customers.length !== 1 ? "s" : ""} enrolled in your loyalty program.
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="pl-9 bg-[#14100E] border-stone-800 text-stone-100 text-xs rounded-xl h-10" />
      </div>

      {isLoading && (
        <div className="py-16 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>
      )}
      {isError && (
        <div className="py-16 text-center text-rose-400 text-sm">Failed to load customers.</div>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="py-16 text-center text-stone-600 text-sm">
          {search ? "No customers match your search." : "No customers yet. Share your QR code to get started!"}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const tier = getTierLabel(c.totalStamps);
            const progress = Math.min((c.activeStamps / (c.targetStamps || 10)) * 100, 100);
            return (
              <Card key={c.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-sm font-black text-stone-400">
                      {(c.firstName?.[0] || "?").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-stone-100">{c.firstName} {c.lastName}</p>
                      <p className="text-[10px] text-stone-500 font-mono">{c.email || c.phone || "—"}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide ${tier.color}`}>
                    {tier.label}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>Progress</span>
                    <span className="font-mono text-stone-400">{c.activeStamps} / {c.targetStamps || 10}</span>
                  </div>
                  <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-stone-500 pt-2 border-t border-stone-900">
                  <span>Total stamps: <span className="text-stone-300 font-bold">{c.totalStamps}</span></span>
                  <span>Redeemed: <span className="text-stone-300 font-bold">{c.rewardRedeemedCount}</span></span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
