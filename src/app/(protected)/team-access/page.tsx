"use client";

import React, { useState } from "react";
import OwnerOnlyGuard from "@/components/OwnerOnlyGuard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Key, Plus, UserCheck, Search, ShieldAlert, Users, Activity, Fingerprint, Trash2, X, Loader2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface StoreLocation { id: string; name: string; }
interface StaffMember {
  id: string;
  userId: string;
  businessId: string;
  storeLocationId: string | null;
  storeLocation: StoreLocation | null;
  user: { id: string; email: string; isActive: boolean; createdAt: string };
}

export default function TeamAccessPage() {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteLocationId, setInviteLocationId] = useState("");

  const { data: staff = [], isLoading, isError } = useQuery<StaffMember[]>({
    queryKey: ["staff"],
    queryFn: () => api.get<StaffMember[]>("/staff"),
  });

  const { data: locations = [] } = useQuery<StoreLocation[]>({
    queryKey: ["store-locations"],
    queryFn: () => api.get<StoreLocation[]>("/business/locations"),
  });

  const inviteMutation = useMutation({
    mutationFn: (body: { email: string; password: string; storeLocationId?: string }) =>
      api.post("/staff", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      success("Staff member invited successfully");
      setShowInvite(false);
      setInviteEmail("");
      setInvitePassword("");
      setInviteLocationId("");
    },
    onError: (err: Error) => toastError(err.message),
  });

  const assignLocationMutation = useMutation({
    mutationFn: ({ staffId, storeLocationId }: { staffId: string; storeLocationId: string | null }) =>
      api.patch(`/staff/${staffId}/location`, { storeLocationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      success("Branch updated");
    },
    onError: (err: Error) => toastError(err.message),
  });

  const removeMutation = useMutation({
    mutationFn: (staffId: string) => api.delete(`/staff/${staffId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      success("Staff member removed");
    },
    onError: (err: Error) => toastError(err.message),
  });

  const filtered = staff.filter((m) => {
    const matchesSearch = m.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && m.user.isActive) ||
      (statusFilter === "inactive" && !m.user.isActive);
    return matchesSearch && matchesStatus;
  });

  const activeCount = staff.filter((m) => m.user.isActive).length;

  return (
    <OwnerOnlyGuard>
    <div className="space-y-8 animate-fade-in text-stone-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50 flex items-center gap-3">
            <Key className="size-7 text-amber-500 shrink-0" />
            Team Access Studio
          </h1>
          <p className="text-xs text-stone-500 font-medium leading-relaxed">
            Provision staff profiles and manage team access to your loyalty system.
          </p>
        </div>
        <Button
          onClick={() => setShowInvite(true)}
          className="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs gap-2 shadow-lg shadow-amber-500/10 self-start sm:self-center transition-all active:scale-[0.98]"
        >
          <Plus className="size-4 stroke-[2.5]" />
          Invite Team Operator
        </Button>
      </div>

      {/* INVITE FORM */}
      {showInvite && (
        <div className="p-5 bg-[#14100E] border border-amber-500/30 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-200 uppercase tracking-wider">Invite New Operator</span>
            <button onClick={() => setShowInvite(false)}>
              <X className="size-4 text-stone-500 hover:text-stone-300" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Email address"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="h-10 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 placeholder:text-stone-600 text-xs border"
            />
            <Input
              placeholder="Temporary password"
              type="password"
              value={invitePassword}
              onChange={(e) => setInvitePassword(e.target.value)}
              className="h-10 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 placeholder:text-stone-600 text-xs border"
            />
          </div>
          {locations.length > 0 && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="size-3" /> Assign Branch (optional)
              </label>
              <select
                value={inviteLocationId}
                onChange={(e) => setInviteLocationId(e.target.value)}
                className="w-full h-9 px-3 bg-[#0C0A09] border border-stone-800 text-stone-100 text-xs rounded-xl outline-none"
              >
                <option value="">— No branch assigned —</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          )}
          <Button
            onClick={() => inviteMutation.mutate({
              email: inviteEmail,
              password: invitePassword,
              ...(inviteLocationId ? { storeLocationId: inviteLocationId } : {}),
            })}
            disabled={!inviteEmail || !invitePassword || inviteMutation.isPending}
            className="h-9 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs gap-2 disabled:opacity-50"
          >
            {inviteMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
            Send Invite
          </Button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#14100E] border border-stone-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="size-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Users className="size-4" />
          </div>
          <div>
            <span className="block text-[9px] font-bold text-stone-600 uppercase tracking-wider font-mono">Total Staff</span>
            <span className="text-xs font-black text-stone-200 block mt-0.5">{staff.length} Members</span>
          </div>
        </div>
        <div className="p-4 bg-[#14100E] border border-stone-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Activity className="size-4" />
          </div>
          <div>
            <span className="block text-[9px] font-bold text-stone-600 uppercase tracking-wider font-mono">Active</span>
            <span className="text-xs font-black text-emerald-400 block mt-0.5">{activeCount} Active</span>
          </div>
        </div>
        <div className="p-4 bg-[#14100E] border border-stone-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="size-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Fingerprint className="size-4" />
          </div>
          <div>
            <span className="block text-[9px] font-bold text-stone-600 uppercase tracking-wider font-mono">Suspended</span>
            <span className="text-xs font-black text-stone-200 block mt-0.5">{staff.length - activeCount} Inactive</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-4 bg-[#14100E] border border-stone-800/80 rounded-2xl flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
          <Input
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 placeholder:text-stone-600 text-xs w-full border"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full lg:w-auto">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex-1 lg:flex-none ${
                statusFilter === s
                  ? "bg-amber-500 border-amber-500 text-stone-950"
                  : "bg-[#0C0A09] border-stone-800/80 text-stone-500 hover:text-stone-300"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* STAFF GRID */}
      {isLoading ? (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="size-6 text-amber-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="py-16 border border-dashed border-rose-800/60 rounded-2xl flex flex-col items-center justify-center text-center">
          <ShieldAlert className="size-8 text-rose-700 stroke-[1.5] mb-2" />
          <span className="text-xs font-bold text-rose-400">Failed to load staff</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filtered.map((member) => {
            const isActive = member.user.isActive;
            const joinedDate = new Date(member.user.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            });

            return (
              <Card key={member.id} className="border-stone-800/80 bg-[#14100E] rounded-2xl shadow-none flex flex-col justify-between hover:border-stone-700 transition-all">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black tracking-widest uppercase border ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {isActive ? "active" : "inactive"}
                      </span>
                      <p className="text-sm font-mono font-bold text-stone-300 mt-1">{member.user.email}</p>
                      <p className="text-[10px] text-stone-600">Joined {joinedDate}</p>
                    </div>
                    <div className="size-10 rounded-xl bg-[#0C0A09] border border-stone-800/80 flex items-center justify-center text-stone-500 shrink-0">
                      <UserCheck className="size-5 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* Branch assignment */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="size-3" /> Branch
                    </label>
                    {locations.length === 0 ? (
                      <p className="text-[11px] text-stone-600">No branches configured</p>
                    ) : (
                      <select
                        value={member.storeLocationId ?? ""}
                        onChange={(e) =>
                          assignLocationMutation.mutate({
                            staffId: member.id,
                            storeLocationId: e.target.value || null,
                          })
                        }
                        className="w-full h-8 px-2 bg-[#0C0A09] border border-stone-800 text-stone-200 text-xs rounded-lg outline-none"
                      >
                        <option value="">— All branches —</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-[#0F0B0A] border-t border-stone-900 flex items-center justify-between text-xs font-bold">
                  <div className="text-[10px] text-stone-600 font-mono">ID: {member.id.slice(0, 8)}…</div>
                  <button
                    onClick={() => removeMutation.mutate(member.id)}
                    disabled={removeMutation.isPending}
                    className="flex items-center gap-1.5 text-stone-600 hover:text-rose-400 transition-colors disabled:opacity-50"
                  >
                    {removeMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                    <span>Remove</span>
                  </button>
                </div>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 border border-dashed border-stone-800/80 rounded-2xl flex flex-col items-center justify-center text-center">
              <ShieldAlert className="size-8 text-stone-700 stroke-[1.5] mb-2" />
              <span className="text-xs font-bold text-stone-400">No Operator Records Found</span>
              <p className="text-[10px] text-stone-600 mt-0.5">
                {staff.length === 0 ? "Invite your first team member to get started." : "Refine your search or filter criteria."}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="p-4 rounded-xl bg-[#14100E]/40 border border-stone-900/60 flex items-center justify-between text-[10px] font-mono text-stone-500">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live data from server</span>
        </div>
        <span className="hidden sm:inline text-stone-600 font-bold uppercase tracking-wider text-[9px]">
          Team Access Management
        </span>
      </div>
    </div>
    </OwnerOnlyGuard>
  );
}
