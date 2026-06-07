"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Store, Loader2, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

interface Merchant {
  id: string;
  name: string;
  ownerEmail: string;
  ownerIsActive: boolean;
  subscriptionStatus: string;
  planName: string;
  createdAt: string;
}

export default function MerchantsPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: merchants = [], isLoading, isError } = useQuery<Merchant[]>({
    queryKey: ["admin-merchants"],
    queryFn: () => api.get<Merchant[]>("/admin/merchants"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      api.patch(`/admin/merchants/${id}/status`, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-merchants"] });
      toast.success("Merchant status updated.");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update status."),
  });

  const filtered = merchants.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    if (status === "ACTIVE" || status === "active") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (status === "TRIAL" || status === "trialing") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-stone-400 bg-stone-800 border-stone-700";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Active Brands</h1>
        <p className="text-xs text-stone-500 font-medium mt-0.5">
          {merchants.length} merchant{merchants.length !== 1 ? "s" : ""} registered.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by business name..."
          className="pl-9 bg-[#14100E] border-stone-800 text-stone-100 text-xs rounded-xl h-10"
        />
      </div>

      {isLoading && (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber-500" />
        </div>
      )}
      {isError && (
        <div className="py-16 text-center text-rose-400 text-sm">Failed to load merchants.</div>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="py-16 text-center text-stone-600 text-sm">
          {search ? "No merchants match your search." : "No merchants registered yet."}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <Card key={m.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center">
                    <Store className="size-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-stone-100">{m.name}</p>
                    <p className="text-[10px] text-stone-500 font-mono">{m.ownerEmail}</p>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide ${statusColor(m.subscriptionStatus)}`}>
                  {m.subscriptionStatus}
                </span>
              </div>

              <div className="flex justify-between text-[10px] text-stone-500 pt-2 border-t border-stone-900">
                <span>Plan: <span className="text-stone-300 font-bold">{m.planName || "—"}</span></span>
                <span>{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => statusMutation.mutate({ id: m.id, active: !m.ownerIsActive })}
                  disabled={statusMutation.isPending}
                  className={`h-7 px-3 text-[10px] font-bold rounded-lg flex-1 ${
                    m.ownerIsActive
                      ? "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                      : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  {m.ownerIsActive ? "Suspend" : "Activate"}
                </Button>
                <Link
                  href={`/merchants/${m.id}`}
                  className="h-7 px-3 text-[10px] font-bold rounded-lg border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-600 flex items-center gap-1 transition-colors"
                >
                  Details <ChevronRight className="size-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
