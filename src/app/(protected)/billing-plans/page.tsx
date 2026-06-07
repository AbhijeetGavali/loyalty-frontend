"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2, Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface Plan {
  id: string;
  name: string;
  code: string;
  monthlyPrice: number;
  maxCustomers: number;
  maxStaff: number;
  maxLocations: number;
  isActive: boolean;
}

const emptyForm = { name: "", code: "", monthlyPrice: "", maxCustomers: "", maxStaff: "", maxLocations: "" };

export default function BillingPlansPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: plans = [], isLoading, isError } = useQuery<Plan[]>({
    queryKey: ["admin-plans"],
    queryFn: () => api.get<Plan[]>("/admin/plans"),
  });

  const createMutation = useMutation({
    mutationFn: (data: object) => api.post("/admin/plans", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-plans"] }); setShowForm(false); setForm(emptyForm); toast.success("Plan created."); },
    onError: (err: Error) => toast.error(err.message || "Failed to create plan."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => api.put(`/admin/plans/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-plans"] }); setEditId(null); toast.success("Plan updated."); },
    onError: (err: Error) => toast.error(err.message || "Failed to update plan."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/plans/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-plans"] }); toast.success("Plan deleted."); },
    onError: (err: Error) => toast.error(err.message || "Failed to delete plan."),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.put(`/admin/plans/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-plans"] }),
    onError: (err: Error) => toast.error(err.message || "Failed to update plan."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      code: form.code,
      monthlyPrice: parseFloat(form.monthlyPrice),
      maxCustomers: parseInt(form.maxCustomers),
      maxStaff: parseInt(form.maxStaff),
      maxLocations: parseInt(form.maxLocations),
    };
    if (editId) updateMutation.mutate({ id: editId, data: payload });
    else createMutation.mutate(payload);
  }

  function startEdit(p: Plan) {
    setEditId(p.id);
    setForm({ name: p.name, code: p.code, monthlyPrice: String(p.monthlyPrice), maxCustomers: String(p.maxCustomers), maxStaff: String(p.maxStaff), maxLocations: String(p.maxLocations) });
    setShowForm(true);
  }

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{label}</label>
      <Input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="bg-stone-900 border-stone-800 text-stone-100 text-xs rounded-xl h-9"
        required
      />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">SaaS Subscriptions</h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">{plans.length} plan{plans.length !== 1 ? "s" : ""} configured.</p>
        </div>
        <Button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="h-9 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
        >
          <Plus className="size-4" /> New Plan
        </Button>
      </div>

      {showForm && (
        <Card className="border-stone-700 bg-[#14100E] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black text-stone-100">{editId ? "Edit Plan" : "Create Plan"}</p>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-stone-500 hover:text-stone-300"><X className="size-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {field("name", "Name")}
            {field("code", "Code")}
            {field("monthlyPrice", "Monthly Price (₹)", "number")}
            {field("maxCustomers", "Max Customers", "number")}
            {field("maxStaff", "Max Staff", "number")}
            {field("maxLocations", "Max Locations", "number")}
            <div className="col-span-2 sm:col-span-3 flex justify-end gap-2 mt-1">
              <Button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="h-8 px-4 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs rounded-xl">Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="h-8 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5">
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                {editId ? "Save" : "Create"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading && <div className="py-16 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>}
      {isError && <div className="py-16 text-center text-rose-400 text-sm">Failed to load plans.</div>}

      {!isLoading && !isError && plans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <Card key={p.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center">
                    <CreditCard className="size-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-stone-100">{p.name}</p>
                    <p className="text-[10px] text-stone-500 font-mono uppercase tracking-widest">{p.code}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleMutation.mutate({ id: p.id, isActive: !p.isActive })}
                  className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide ${p.isActive ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-stone-400 bg-stone-800 border-stone-700"}`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="text-center py-2 border-y border-stone-900">
                <span className="text-2xl font-black text-amber-400">₹{p.monthlyPrice}</span>
                <span className="text-xs text-stone-500 ml-1">/ mo</span>
              </div>

              <div className="flex justify-between text-[10px] text-stone-500">
                <span>Customers: <span className="text-stone-300 font-bold">{p.maxCustomers}</span></span>
                <span>Staff: <span className="text-stone-300 font-bold">{p.maxStaff}</span></span>
                <span>Locations: <span className="text-stone-300 font-bold">{p.maxLocations}</span></span>
              </div>

              <div className="flex gap-2 pt-1 border-t border-stone-900">
                <button onClick={() => startEdit(p)} className="flex-1 h-7 text-[10px] font-bold rounded-lg border border-stone-700 text-stone-400 hover:text-stone-200 flex items-center justify-center gap-1">
                  <Pencil className="size-3" /> Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(p.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 h-7 text-[10px] font-bold rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-1"
                >
                  <Trash2 className="size-3" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
