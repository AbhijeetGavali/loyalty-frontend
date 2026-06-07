"use client";

import { useEffect, useState } from "react";
import OwnerOnlyGuard from "@/components/OwnerOnlyGuard";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/select";
import {
  Store,
  MapPin,
  Mail,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  KeyRound,
  ShieldX,
  Sparkles,
  Zap,
  Star,
  Rocket,
  Check,
  CreditCard,
  Sliders,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp as useAuth } from "@/lib/appContext";
import { useToast } from "@/components/ui/toast";

const STORE_CLASSIFICATIONS = [
  { value: "Coffee Shop", label: "Coffee Shop / Roastery" },
  { value: "Bakery", label: "Boutique Bakery" },
  { value: "Restaurant", label: "Bistro & Eatery" },
  { value: "Salon", label: "Salon / Wellness Studio" },
  { value: "Retail", label: "Boutique Retailer" },
];

export default function StoreSettingsPage() {
  const router = useRouter();
  const { setToken, role } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "billing">("profile");
  useEffect(() => { if (role === 'BUSINESS_STAFF') setActiveTab('profile'); }, [role]);

  // Component Local Status Systems
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile Form States
  const [businessName, setBusinessName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Account Purge States
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deleteAuthPassword, setDeleteAuthPassword] = useState("");

  // ==========================================
  // QUERY STRATEGIES (TANSTACK QUERY)
  // ==========================================

  // Fetch Current Profile Data
  const { isLoading: isProfileLoading } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: async () => {
      const data = await api.get<{ business: { name: string; location?: string; type?: string; googleReviewUrl?: string }; user: { email: string } }>("/business/me");
      if (data) {
        setBusinessName(data.business.name || "");
        setStoreType(data.business.type || "");
        setLocation(data.business.location || "");
        setEmail(data.user.email || "");
        setGoogleReviewUrl(data.business.googleReviewUrl || "");
      }
      return data;
    },
  });

  // Fetch Current Subscription
  interface BillingSub { planId?: string; status?: string; trialEndAt?: string; plan?: { name?: string; id?: string; monthlyPrice?: number } }
  interface BillingPlan { id: string; name: string; code: string; monthlyPrice: number; maxCustomers?: number; maxStaff?: number; maxLocations?: number }

  const { data: currentSub, isLoading: isSubLoading } = useQuery({
    queryKey: ["my-subscription"],
    queryFn: () => api.get<BillingSub>("/billing/current"),
  });

  // Fetch Available Plans
  const { data: plans, isLoading: isPlansLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => api.get<BillingPlan[]>("/billing/plans"),
  });

  // Process Subscription Tier Requests
  const subscribeMutation = useMutation({
    mutationFn: (planId: string) => api.post<{ url: string }>("/billing/subscribe", { planId }),
    onSuccess: () => toast.info("Redirecting to payment checkout..."),
    onError: (err: Error) => showFeedback("error", err.message || "Payment gateway initiation failed."),
  });

  const showFeedback = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    if (type === "success") toast.success(text);
    else toast.error(text);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Profile Event Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating("profile");
    setMessage(null);
    try {
      await api.put("/business/me", { name: businessName, type: storeType, location, googleReviewUrl });
      showFeedback("success", "Storefront settings updated successfully.");
    } catch (err) {
      showFeedback("error", (err as Error).message || "Failed to update profile.");
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showFeedback("error", "Passwords do not match.");
      return;
    }
    setUpdating("security");
    setMessage(null);
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      showFeedback("success", "Password updated successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    } catch (err) {
      showFeedback("error", (err as Error).message || "Failed to update password.");
    } finally {
      setUpdating(null);
    }
  };

  const handleAccountDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmationText !== "DELETE MY ACCOUNT") {
      showFeedback("error", "Please type the exact verification phrase.");
      return;
    }
    setUpdating("destruction");
    try {
      // Account deletion endpoint not yet implemented — clear session locally
      setToken(null);
      if (typeof window !== "undefined") localStorage.clear();
      router.push("/login");
    } catch (err) {
      showFeedback("error", (err as Error).message || "Account deletion failed.");
    } finally {
      setUpdating(null);
    }
  };

  const getPlanIcon = (code: string) => {
    switch (code?.toUpperCase()) {
      case "STARTER":
        return <Zap className="size-5 text-sky-400" />;
      case "PROFESSIONAL":
        return <Star className="size-5 text-amber-400" />;
      case "ENTERPRISE":
        return <Rocket className="size-5 text-violet-400" />;
      default:
        return <Zap className="size-5 text-stone-400" />;
    }
  };

  // Master layout global loader context state
  const globalLoading = isProfileLoading || isSubLoading || isPlansLoading;

  if (globalLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 size-10 rounded-full border-2 border-amber-500/10 animate-ping" />
          <Loader2 className="size-8 text-amber-500 animate-spin stroke-[1.5]" />
        </div>
        <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest animate-pulse">
          Syncing settings...
        </span>
      </div>
    );
  }

  return (
    <OwnerOnlyGuard>
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* HEADER CONTROLS SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-900">
        <div>
          <h1 className="text-2xl font-black text-stone-50 tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-stone-400 font-medium mt-0.5">
            Manage your business profile, security, and billing.
          </p>
        </div>

        {/* TAB CONTROLLERS SELECTORS */}
        <div className="flex p-1 bg-[#14100E] border border-stone-850 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "profile"
                ? "bg-[#0C0A09] text-amber-500 shadow-md border border-stone-900"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Sliders className="size-3.5" />
            Profile
          </button>
          {role !== 'BUSINESS_STAFF' && (
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "billing"
                ? "bg-[#0C0A09] text-amber-500 shadow-md border border-stone-900"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <CreditCard className="size-3.5" />
            Billing
          </button>
          )}
        </div>
      </div>

      {/* FEEDBACK STATUS BAR CONTAINER */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-semibold shadow-xl backdrop-blur-md animate-fade-in ${
            message.type === "success"
              ? "bg-emerald-500/[0.02] border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/[0.02] border-rose-500/20 text-rose-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertTriangle className="size-4 shrink-0 text-rose-500" />
          )}
          <span className="leading-normal">{message.text}</span>
        </div>
      )}

      {/* ==========================================
          TAB ROUTER CONTROLLER PANEL VIEWPORTS
         ========================================== */}

      {activeTab === "profile" ? (
        <div className="space-y-8 animate-fade-in">
          {/* PROFILE CARD FIELDSET */}
          <Card className="border-stone-900 bg-[#14100E] rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <CardHeader className="bg-stone-950/20 p-6 sm:p-8 border-b border-stone-900/60 flex flex-row items-start gap-4 space-y-0">
              <div className="size-10 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Store className="size-4 stroke-[2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-black text-stone-100 tracking-wider font-mono uppercase">
                  Business Profile
                </CardTitle>
                <CardDescription className="text-stone-400 text-xs mt-0.5">
                  Update your business name, type, location, and Google Review link.
                </CardDescription>
              </div>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-950/[0.05]">
                <div className="space-y-2">
                  <Label
                    htmlFor="bizName"
                    className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                  >
                    Brand / Business Name
                  </Label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
                    <Input
                      id="bizName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-11 pl-10 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 text-xs focus-visible:ring-amber-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <CustomSelect
                    label="Business Type"
                    placeholder="Select your business type"
                    options={STORE_CLASSIFICATIONS}
                    value={storeType}
                    onValueChange={(val) => setStoreType(val)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="loc"
                    className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                  >
                    Address / Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
                    <Input
                      id="loc"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-11 pl-10 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 text-xs focus-visible:ring-amber-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="googleReviewUrl"
                    className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                  >
                    Google Review Link
                  </Label>
                  <div className="relative">
                    <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
                    <Input
                      id="googleReviewUrl"
                      type="url"
                      value={googleReviewUrl}
                      onChange={(e) => setGoogleReviewUrl(e.target.value)}
                      placeholder="https://g.page/r/..."
                      className="h-11 pl-10 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 text-xs focus-visible:ring-amber-500 placeholder:text-stone-700"
                    />
                  </div>
                  <p className="text-[10px] text-stone-600">Customers will be prompted to leave a review after each stamp.</p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="mail"
                    className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                  >
                    Email Address
                  </Label>
                  <div className="relative opacity-50 cursor-not-allowed">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
                    <Input
                      id="mail"
                      type="email"
                      value={email}
                      disabled
                      className="h-11 pl-10 rounded-xl bg-[#0C0A09]/40 border-stone-900 text-stone-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-[#0C0A09]/30 border-t border-stone-900/60 px-6 sm:px-8 py-4 flex justify-between items-center">
                <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-500/40" /> Changes
                  apply in real time.
                </span>
                <Button
                  type="submit"
                  disabled={updating !== null}
                  className="h-10 px-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl flex items-center gap-2"
                >
                  {updating === "profile" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="size-3.5" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* PASSWORD SECTION */}
          <Card className="border-stone-900 bg-[#14100E] rounded-2xl overflow-hidden shadow-2xl relative">
            <CardHeader className="bg-stone-950/20 p-6 sm:p-8 border-b border-stone-900/60 flex flex-row items-start gap-4 space-y-0">
              <div className="size-10 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <KeyRound className="size-4 stroke-[2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-black text-stone-100 tracking-wider font-mono uppercase">
                  Change Password
                </CardTitle>
                <CardDescription className="text-stone-400 text-xs mt-0.5">
                  Update your account password periodically for security.
                </CardDescription>
              </div>
            </CardHeader>
            <form onSubmit={handleUpdateSecurity}>
              <CardContent className="p-6 sm:p-8 space-y-5 bg-stone-950/[0.05]">
                <div className="space-y-2">
                  <Label
                    htmlFor="currPass"
                    className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="currPass"
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 text-xs focus-visible:ring-amber-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPass"
                      className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                    >
                      New Password
                    </Label>
                    <Input
                      id="newPass"
                      type="password"
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 text-xs focus-visible:ring-amber-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confPass"
                      className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      id="confPass"
                      type="password"
                      placeholder="••••••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/80 text-stone-100 text-xs focus-visible:ring-amber-500"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-[#0C0A09]/30 border-t border-stone-900/60 px-6 sm:px-8 py-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={updating !== null}
                  className="h-10 px-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl flex items-center gap-2"
                >
                  {updating === "security" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <KeyRound className="size-3.5" />
                  )}
                  Rotate Passphrase Keys
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* CRITICAL CORE SYSTEM DESTRUCTION CONTAINER */}
          <Card className="border-rose-950/40 bg-gradient-to-b from-[#14100E] to-[#1A1110] rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />
            <CardHeader className="bg-rose-950/[0.04] p-6 sm:p-8 border-b border-rose-950/20 flex flex-row items-start gap-4 space-y-0">
              <div className="size-10 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="size-4 stroke-[2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-black text-rose-400 tracking-wider font-mono uppercase">
                  Delete Account
                </CardTitle>
                <CardDescription className="text-stone-400 text-xs mt-0.5">
                  Permanently delete your account, all customer data, and loyalty history.
                </CardDescription>
              </div>
            </CardHeader>
            <form onSubmit={handleAccountDeletion}>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="p-4 bg-rose-500/[0.02] border border-rose-500/10 rounded-xl flex gap-3.5 text-xs text-rose-300 leading-relaxed font-medium max-w-3xl">
                  <AlertTriangle className="size-4 shrink-0 text-rose-500 mt-0.5" />
                  <div className="space-y-1">
                    <span className="block font-bold text-rose-400">
                      This action is permanent and cannot be undone
                    </span>
                    <p className="text-stone-400 text-[11px]">
                      Your business, all customer loyalty cards, and stamp history will be permanently deleted.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="deleteConfirm"
                      className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                    >
                      Confirm Deletion
                    </Label>
                    <Input
                      id="deleteConfirm"
                      placeholder="Type DELETE MY ACCOUNT"
                      value={deleteConfirmationText}
                      onChange={(e) =>
                        setDeleteConfirmationText(e.target.value)
                      }
                      className="h-11 px-4 rounded-xl bg-[#0C0A09] border-stone-800/60 focus-visible:ring-rose-500 text-stone-100 text-xs placeholder:text-stone-800 font-medium"
                      required
                    />
                    <span className="block text-[10px] text-stone-600 font-medium">
                      Type{" "}
                      <span className="text-rose-400/70 font-mono font-bold select-all">
                        DELETE MY ACCOUNT
                      </span>{" "}
                      inside this field to confirm.
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="deletePass"
                      className="text-xs font-black text-stone-400 uppercase tracking-wider font-mono"
                    >
                      Your Password
                    </Label>
                    <Input
                      id="deletePass"
                      type="password"
                      placeholder="••••••••••••"
                      value={deleteAuthPassword}
                      onChange={(e) => setDeleteAuthPassword(e.target.value)}
                      className="h-11 rounded-xl bg-[#0C0A09] border-stone-800/60 focus-visible:ring-rose-500 text-stone-100 text-xs placeholder:text-stone-800"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-rose-950/[0.04] border-t border-rose-950/20 px-6 sm:px-8 py-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    updating !== null ||
                    deleteConfirmationText !== "DELETE MY ACCOUNT"
                  }
                  className="h-10 px-5 bg-rose-600 hover:bg-rose-500 disabled:bg-stone-900 disabled:border-stone-800 disabled:text-stone-600 font-black text-xs rounded-xl flex items-center gap-2"
                >
                  {updating === "destruction" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ShieldX className="size-3.5" />
                  )}
                  Delete My Account
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* SUBSCRIPTION SUMMARY BANNER LAYOUT */}
          <Card className="border-stone-800/40 bg-gradient-to-r from-stone-950 to-[#191512] rounded-2xl relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/[0.02] to-transparent pointer-events-none" />
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-500/80 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-md w-fit">
                  Current Plan
                </div>
                <h3 className="font-black text-xl text-stone-100 tracking-tight flex items-center gap-2.5">
                  Active Plan:{" "}
                  <span className="text-amber-400 font-mono">
                    {currentSub?.plan?.name || "Free Trial"}
                  </span>
                </h3>
                <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
                  {currentSub?.status === "TRIAL"
                    ? `Your free trial runs until ${currentSub.trialEndAt ? new Date(currentSub.trialEndAt).toLocaleDateString() : "—"}. Upgrade anytime below.`
                    : `Your subscription is active (${currentSub?.status?.toLowerCase()}).`}
                </p>
              </div>
              <div className="sm:text-right shrink-0 bg-stone-900/40 border border-stone-850 p-4 rounded-xl min-w-[140px]">
                <div className="text-2xl font-black text-stone-50 font-mono">
                  ₹{currentSub?.plan?.monthlyPrice || 0}
                  <span className="text-xs font-normal text-stone-500 font-sans">
                    /mo
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider mt-0.5">
                  per month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* DYNAMIC PLAN CARDS SCALER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans?.map((plan) => {
              const isActivePlan = plan.id === currentSub?.planId;
              return (
                <Card
                  key={plan.id}
                  className={`flex flex-col bg-[#14100E] rounded-2xl overflow-hidden transition-all duration-300 relative ${
                    isActivePlan
                      ? "border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.02)]"
                      : "border-stone-900 hover:border-stone-800"
                  }`}
                >
                  {isActivePlan && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[9px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
                      Current Plan
                    </div>
                  )}
                  <CardHeader className="p-6 border-b border-stone-900/60 bg-stone-950/20">
                    <div className="size-11 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-center mb-4">
                      {getPlanIcon(plan.code)}
                    </div>
                    <CardTitle className="text-md font-black text-stone-100 tracking-tight">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-stone-400 text-xs mt-1">
                      Includes all core features for your business.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 p-6 space-y-6 bg-stone-950/[0.03]">
                    <div className="text-3xl font-black text-stone-50 font-mono tracking-tight">
                      ₹{plan.monthlyPrice}{" "}
                      <span className="text-xs font-normal text-stone-500 font-sans tracking-normal">
                        /mo
                      </span>
                    </div>

                    <div className="h-[1px] bg-stone-900" />

                    <ul className="space-y-3 text-xs font-medium text-stone-300">
                      <li className="flex items-center gap-2.5">
                        <div className="size-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                        <span>
                          Up to{" "}
                          <strong className="text-stone-100 font-semibold">
                            {plan.maxCustomers}
                          </strong>{" "}
                          customers
                        </span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <div className="size-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                        <span>
                          Up to{" "}
                          <strong className="text-stone-100 font-semibold">
                            {plan.maxStaff}
                          </strong>{" "}
                          workspace operators
                        </span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <div className="size-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                        <span>Dynamic ledger QR updates</span>
                      </li>
                    </ul>
                  </CardContent>

                  <CardFooter className="p-6 border-t border-stone-900/60 bg-stone-950/10">
                    <Button
                      className={`w-full h-10 rounded-xl text-xs font-black tracking-wide transition-all duration-200 ${
                        isActivePlan
                          ? "bg-stone-900 text-stone-400 border border-stone-800/80 cursor-default"
                          : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/5 active:scale-[0.98]"
                      }`}
                      variant={isActivePlan ? "outline" : "default"}
                      disabled={isActivePlan || subscribeMutation.isPending}
                      onClick={() => subscribeMutation.mutate(plan.id)}
                    >
                      {isActivePlan ? (
                        "Current Active Engine"
                      ) : subscribeMutation.isPending ? (
                        <Loader2 className="size-3.5 animate-spin mx-auto" />
                      ) : (
                        "Provision Engine Layer"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </OwnerOnlyGuard>
  );
}
