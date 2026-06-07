"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ticket, Plus, Loader2, Pencil, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface LoyaltyProgram {
  id: string;
  title: string;
  stampsRequired: number;
  rewardTitle: string;
  rewardDescription?: string;
  isActive: boolean;
}

export default function StampCardsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", stampsRequired: 10, rewardTitle: "", rewardDescription: "" });

  const { data: programs = [], isLoading } = useQuery<LoyaltyProgram[]>({
    queryKey: ["loyalty-programs"],
    queryFn: () => api.get<LoyaltyProgram[]>("/loyalty-program"),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post("/loyalty-program", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: typeof form & { id: string }) => api.put(`/loyalty-program/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] }); setEditingId(null); setShowForm(false); },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/loyalty-program/${id}/toggle`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate({ id: editingId, ...form });
    else createMutation.mutate(form);
  };

  const startEdit = (p: LoyaltyProgram) => {
    setEditingId(p.id);
    setForm({ title: p.title, stampsRequired: p.stampsRequired, rewardTitle: p.rewardTitle, rewardDescription: p.rewardDescription || "" });
    setShowForm(true);
  };

  const filtered = programs.filter((c) => filter === "all" || (filter === "active" ? c.isActive : !c.isActive));

  return (
    <div className="space-y-8 animate-fade-in text-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50 flex items-center gap-3">
            <Ticket className="size-7 text-amber-500 shrink-0" />
            Stamp Cards
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">Configure loyalty programs for your customers.</p>
        </div>
        <Button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: "", stampsRequired: 10, rewardTitle: "", rewardDescription: "" }); }}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl flex items-center gap-2 h-10 px-4 self-start sm:self-center"
        >
          <Plus className="size-3.5" /> New Program
        </Button>
      </div>

      {showForm && (
        <Card className="border-stone-800 bg-[#14100E] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-stone-100">{editingId ? "Edit Program" : "Create Program"}</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }}><X className="size-4 text-stone-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "title", label: "Program Title", type: "text" },
              { key: "stampsRequired", label: "Stamps Required", type: "number" },
              { key: "rewardTitle", label: "Reward Title", type: "text" },
              { key: "rewardDescription", label: "Reward Description", type: "text", optional: true },
            ].map(({ key, label, type, optional }) => (
              <div key={key} className="space-y-1">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{label}</label>
                <input
                  type={type}
                  min={type === "number" ? 1 : undefined}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
                  required={!optional}
                  className="w-full h-10 px-3 bg-[#0C0A09] border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
            ))}
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                className="h-9 px-4 text-xs rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300">Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                className="h-9 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl">
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="size-3.5 animate-spin" /> : editingId ? "Save Changes" : "Create Program"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-2">
        {(["all", "active", "paused"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${filter === f ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-stone-500 hover:text-stone-300"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 border border-dashed border-stone-800 rounded-2xl text-center">
          <Ticket className="size-8 text-stone-700 mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-400">No programs found.</p>
          <p className="text-[10px] text-stone-600 mt-0.5">Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((p) => (
            <Card key={p.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${p.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-stone-800 text-stone-500"}`}>
                    {p.isActive ? "Active" : "Paused"}
                  </span>
                  <h3 className="text-sm font-black text-stone-100 mt-1">{p.title}</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Reward: <span className="text-amber-400">{p.rewardTitle}</span></p>
                  {p.rewardDescription && <p className="text-[10px] text-stone-600 mt-0.5">{p.rewardDescription}</p>}
                </div>
                <div className="size-12 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center shrink-0">
                  <span className="text-lg font-black text-stone-100">{p.stampsRequired}</span>
                  <span className="text-[8px] text-stone-600 font-bold uppercase">stamps</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-900">
                <button
                  onClick={() => toggleMutation.mutate(p.id)}
                  disabled={toggleMutation.isPending}
                  className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${p.isActive ? "text-stone-400 hover:text-rose-400" : "text-stone-400 hover:text-emerald-400"}`}
                >
                  {toggleMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : p.isActive ? "Pause" : "Set Active"}
                </button>
                <button onClick={() => startEdit(p)} className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-amber-400 transition-colors">
                  <Pencil className="size-3" /> Edit
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
