"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (!token) { toast.error("Invalid reset link"); return; }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword: password });
      toast.success("Password reset! You can now log in.");
      setDone(true);
      setTimeout(() => router.replace("/login"), 2000);
    } catch (err) {
      toast.error((err as Error).message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="size-5 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-stone-100">New Password</h1>
          <p className="text-xs text-stone-500 mt-1">Enter your new password below.</p>
        </div>
        {done ? (
          <div className="text-center space-y-2">
            <CheckCircle2 className="size-8 text-emerald-400 mx-auto" />
            <p className="text-sm text-emerald-400 font-bold">Password updated! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-300">New Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="h-11 rounded-xl bg-[#14100E] border-stone-800 text-stone-100" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-300">Confirm Password</Label>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                className="h-11 rounded-xl bg-[#14100E] border-stone-800 text-stone-100" />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        )}
        <p className="text-center text-xs text-stone-600">
          <Link href="/login" className="text-amber-500 hover:text-amber-400">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
