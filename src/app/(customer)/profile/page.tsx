"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function ProfilePage() {
  const toast = useToast();

  const { data: profile, isLoading, isError } = useQuery<any>({
    queryKey: ["customer-me"],
    queryFn: () => api.get<any>("/customer/me"),
  });

  const profileMutation = useMutation({
    mutationFn: (data: { firstName: string; lastName: string; phone: string }) =>
      api.put("/customer/me", data),
    onSuccess: () => toast.success("Profile updated."),
    onError: (err: any) => toast.error(err.message || "Failed to update profile."),
  });

  const pinMutation = useMutation({
    mutationFn: (data: { currentPin: string; newPin: string }) =>
      api.post("/customer/change-pin", data),
    onSuccess: () => toast.success("PIN updated successfully."),
    onError: (err: any) => toast.error(err.message || "Failed to change PIN."),
  });

  function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    profileMutation.mutate({
      firstName: fd.get("firstName") as string,
      lastName: fd.get("lastName") as string,
      phone: fd.get("phone") as string,
    });
  }

  function handlePinSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const currentPin = fd.get("currentPin") as string;
    const newPin = fd.get("newPin") as string;
    const confirmPin = fd.get("confirmPin") as string;
    if (newPin !== confirmPin) { toast.error("New PINs do not match."); return; }
    pinMutation.mutate({ currentPin, newPin });
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] px-4 py-8 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-50 tracking-tight">My Profile</h1>
        <p className="text-xs text-stone-500 mt-1">Update your details and change your PIN.</p>
      </div>

      {isLoading && (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber-500" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="py-20 text-center text-rose-400 text-sm">Failed to load profile.</p>
      )}

      {!isLoading && !isError && profile && (
        <>
          {/* Profile Info */}
          <Card className="border-stone-800 bg-[#14100E] rounded-3xl p-6">
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Personal Info</p>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {[
                { name: "firstName", label: "First Name", defaultValue: profile.firstName },
                { name: "lastName", label: "Last Name", defaultValue: profile.lastName },
                { name: "phone", label: "Phone", defaultValue: profile.phone, type: "tel" },
              ].map(({ name, label, defaultValue, type }) => (
                <div key={name} className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</label>
                  <input
                    name={name}
                    type={type ?? "text"}
                    defaultValue={defaultValue ?? ""}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-100 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-amber-500/50"
                  />
                </div>
              ))}
              <Button
                type="submit"
                disabled={profileMutation.isPending}
                className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 mt-2"
              >
                {profileMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
              </Button>
            </form>
          </Card>

          {/* Change PIN */}
          <Card className="border-stone-800 bg-[#14100E] rounded-3xl p-6">
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Change PIN</p>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              {[
                { name: "currentPin", label: "Current PIN" },
                { name: "newPin", label: "New PIN" },
                { name: "confirmPin", label: "Confirm New PIN" },
              ].map(({ name, label }) => (
                <div key={name} className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</label>
                  <input
                    name={name}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    minLength={4}
                    required
                    placeholder="••••"
                    className="w-full bg-stone-900 border border-stone-800 text-stone-100 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-amber-500/50 tracking-widest"
                  />
                </div>
              ))}
              <Button
                type="submit"
                disabled={pinMutation.isPending}
                className="w-full h-11 bg-stone-800 hover:bg-stone-700 text-stone-100 font-black text-sm rounded-2xl flex items-center justify-center gap-2 mt-2"
              >
                {pinMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Update PIN"}
              </Button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
