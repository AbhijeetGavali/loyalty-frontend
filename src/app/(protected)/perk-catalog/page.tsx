"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Gift, Sparkles, Loader2, Pencil, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function PerkCatalogPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ rewardTitle: "", rewardDescription: "" });

  const { data: programs = [], isLoading } = useQuery<any[]>({
    queryKey: ["loyalty-programs"],
    queryFn: () => api.get<any[]>("/loyalty-program"),
    select: (d: any) => (Array.isArray(d) ? d : d ? [d] : []),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/loyalty-program/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] }); setEditingId(null); },
  });

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({ rewardTitle: p.rewardTitle, rewardDescription: p.rewardDescription || "" });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Perk Catalog</h1>
        <p className="text-xs text-stone-500 mt-0.5 font-medium">Edit reward perks for each loyalty program.</p>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>
      ) : programs.length === 0 ? (
        <div className="py-16 text-center text-stone-600 text-sm">No loyalty programs yet. Create one in Stamp Cards first.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {programs.map((p: any) => (
            <Card key={p.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center">
                    <Gift className="size-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Program: <span className="text-stone-300">{p.title}</span></p>
                    <p className="text-[10px] text-stone-600">{p.stampsRequired} stamps required</p>
                  </div>
                </div>
                {editingId !== p.id && (
                  <button onClick={() => startEdit(p)} className="text-[11px] text-stone-400 hover:text-amber-400 flex items-center gap-1">
                    <Pencil className="size-3" /> Edit Perk
                  </button>
                )}
              </div>

              {editingId === p.id ? (
                <form onSubmit={e => { e.preventDefault(); updateMutation.mutate({ id: p.id, ...form }); }} className="space-y-3 pt-2 border-t border-stone-900">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Reward Title</label>
                    <input value={form.rewardTitle} onChange={e => setForm(f => ({ ...f, rewardTitle: e.target.value }))} required
                      className="w-full h-9 px-3 bg-[#0C0A09] border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Reward Description</label>
                    <input value={form.rewardDescription} onChange={e => setForm(f => ({ ...f, rewardDescription: e.target.value }))}
                      className="w-full h-9 px-3 bg-[#0C0A09] border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500/50" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="h-8 px-3 text-xs rounded-xl border-stone-800 text-stone-400">Cancel</Button>
                    <Button type="submit" disabled={updateMutation.isPending} className="h-8 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl">
                      {updateMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : "Save Perk"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="pt-2 border-t border-stone-900 space-y-1">
                  <p className="text-sm font-bold text-amber-400">{p.rewardTitle}</p>
                  <p className="text-xs text-stone-500">{p.rewardDescription || "No description set."}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
