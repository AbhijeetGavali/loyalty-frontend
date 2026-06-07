"use client";

import React, { useState } from "react";
import OwnerOnlyGuard from "@/components/OwnerOnlyGuard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Store, Trash2, Pencil, Loader2, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = { name: "", address: "", phone: "" };

export default function StoreLocationsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: locations = [], isLoading, isError } = useQuery<Location[]>({
    queryKey: ["store-locations"],
    queryFn: () => api.get<Location[]>("/business/locations"),
  });

  const createMutation = useMutation({
    mutationFn: (data: object) => api.post("/business/locations", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["store-locations"] }); setShowForm(false); setForm(emptyForm); toast.success("Location added."); },
    onError: (err: any) => toast.error(err.message || "Failed to add location."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => api.put(`/business/locations/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["store-locations"] }); setEditId(null); setShowForm(false); toast.success("Location updated."); },
    onError: (err: any) => toast.error(err.message || "Failed to update location."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/business/locations/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["store-locations"] }); toast.success("Location removed."); },
    onError: (err: any) => toast.error(err.message || "Failed to delete location."),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.put(`/business/locations/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["store-locations"] }),
    onError: (err: any) => toast.error(err.message || "Failed to update."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) updateMutation.mutate({ id: editId, data: form });
    else createMutation.mutate(form);
  }

  function startEdit(loc: Location) {
    setEditId(loc.id);
    setForm({ name: loc.name, address: loc.address, phone: loc.phone ?? "" });
    setShowForm(true);
  }

  return (
    <OwnerOnlyGuard>
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50 flex items-center gap-3">
            <Store className="size-7 text-amber-500 shrink-0" />
            Store Locations
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">Manage your physical branches.</p>
        </div>
        <Button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs gap-2 self-start sm:self-center"
        >
          <Plus className="size-4" /> Add Location
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-stone-700 bg-[#14100E] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black text-stone-100">{editId ? "Edit Location" : "New Location"}</p>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-stone-500 hover:text-stone-300"><X className="size-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { key: "name" as const, label: "Location Name", placeholder: "Downtown Branch" },
              { key: "address" as const, label: "Address", placeholder: "123 Main St, City" },
              { key: "phone" as const, label: "Phone (optional)", placeholder: "+91 9876543210" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{label}</label>
                <Input
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  required={key !== "phone"}
                  className="bg-stone-900 border-stone-800 text-stone-100 text-xs rounded-xl h-9"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="h-8 px-4 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs rounded-xl">Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="h-8 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5">
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                {editId ? "Save" : "Add"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Summary */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Store className="size-4 text-stone-600" />
        <span>{locations.length} location{locations.length !== 1 ? "s" : ""} · {locations.filter(l => l.isActive).length} active</span>
      </div>

      {isLoading && <div className="py-16 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>}
      {isError && <div className="py-16 text-center text-rose-400 text-sm">Failed to load locations.</div>}
      {!isLoading && !isError && locations.length === 0 && !showForm && (
        <div className="py-16 border border-dashed border-stone-800 rounded-2xl text-center">
          <MapPin className="size-8 text-stone-700 mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-400">No locations yet</p>
          <p className="text-[10px] text-stone-600 mt-0.5">Add your first branch to get started.</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <Card key={loc.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-black text-stone-100">{loc.name}</h3>
                <p className="text-xs text-stone-400 flex items-start gap-1 mt-1">
                  <MapPin className="size-3 shrink-0 mt-0.5 text-stone-600" /> {loc.address}
                </p>
                {loc.phone && <p className="text-[11px] text-stone-500 mt-0.5">{loc.phone}</p>}
              </div>
              <button
                onClick={() => toggleMutation.mutate({ id: loc.id, isActive: !loc.isActive })}
                className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase shrink-0 ${loc.isActive ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-stone-400 bg-stone-800 border-stone-700"}`}
              >
                {loc.isActive ? "Active" : "Inactive"}
              </button>
            </div>
            <div className="flex gap-2 pt-1 border-t border-stone-900">
              <button onClick={() => startEdit(loc)} className="flex-1 h-7 text-[10px] font-bold rounded-lg border border-stone-700 text-stone-400 hover:text-stone-200 flex items-center justify-center gap-1">
                <Pencil className="size-3" /> Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(loc.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 h-7 text-[10px] font-bold rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-1"
              >
                <Trash2 className="size-3" /> Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </OwnerOnlyGuard>
  );
}
