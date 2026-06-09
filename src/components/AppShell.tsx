"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp as useAuth } from "@/lib/appContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAnalytics } from "@/lib/analytics";
import { Menu, X, Loader2 } from "lucide-react";
import UpgradePremiumOverlay from "./UpgradePremiumOverlay";
import ComingSoonOverlay from "./ComingSoonOverlay";

// ============================================================================
// ROLE-SPECIFIC APPLICATION ROUTING DEFINITIONS
// ============================================================================

const MERCHANT_NAV = {
  main: [
    { to: "/dashboard", label: "Overview", icon: "📊", tier: "free" },
    { to: "/our-regulars", label: "Our Regulars", icon: "👥", tier: "free" },
    { to: "/customer-analytics", label: "Customer Analytics", icon: "🧬", tier: "free" },
    { to: "/stamp-cards", label: "Stamp Cards", icon: "🎟️", tier: "free" },
    { to: "/perk-catalog", label: "Perk Catalog", icon: "🎁", tier: "free" },
  ],
  operations: [
    {
      to: "/counter-displays",
      label: "Counter Displays",
      icon: "📱",
      tier: "free",
    },
    { to: "/stamp-ledger", label: "Stamp Ledger", icon: "🧾", tier: "free" },
    {
      to: "/store-locations",
      label: "Store Locations",
      icon: "📍",
      tier: "free",
    },
    { to: "/invoices", label: "Invoices", icon: "🧾", tier: "free" },
    { to: "/team-access", label: "Team Access", icon: "🔑", tier: "free" },
    {
      to: "/anti-fraud-studio",
      label: "Anti-Fraud Studio",
      icon: "🛡️",
      tier: "free",
    },
  ],
  business: [
    // {
    //   to: "/pos-integrations",
    //   label: "POS Integrations",
    //   icon: "🔌",
    //   tier: "free",
    // },
    {
      to: "/sms-marketing",
      label: "SMS Marketing",
      icon: "💬",
      tier: "free",
    },
    {
      to: "/roi-analytics",
      label: "ROI Analytics",
      icon: "📈",
      tier: "free",
    },
    {
      to: "/affiliate",
      label: "Affiliate Program",
      icon: "🤝",
      tier: "free",
    },
  ],
  system: [
    { to: "/subscription", label: "Subscription", icon: "💳", tier: "free" },
    { to: "/settings", label: "Settings", icon: "⚙️", tier: "free" },
  ],
};

// Staff can only access operational/transaction pages — no business config or analytics
const STAFF_NAV = {
  main: [
    { to: "/dashboard", label: "Overview", icon: "📊", tier: "free" },
    { to: "/our-regulars", label: "Our Regulars", icon: "👥", tier: "free" },
    { to: "/stamp-cards", label: "Stamp Cards", icon: "🎟️", tier: "free" },
    { to: "/perk-catalog", label: "Perk Catalog", icon: "🎁", tier: "free" },
  ],
  operations: [
    { to: "/counter-displays", label: "Counter Displays", icon: "📱", tier: "free" },
    { to: "/stamp-ledger", label: "Stamp Ledger", icon: "🧾", tier: "free" },
    { to: "/invoices", label: "Invoices", icon: "🧾", tier: "free" },
    { to: "/anti-fraud-studio", label: "Anti-Fraud Studio", icon: "🛡️", tier: "free" },
  ],
};

const SUPERADMIN_NAV = [
  { to: "/dashboard", label: "Platform Overview", icon: "📊", tier: "free" },
  { to: "/merchants", label: "Active Brands", icon: "🏪", tier: "free" },
  {
    to: "/billing-plans",
    label: "SaaS Subscriptions",
    icon: "💰",
    tier: "free",
  },
  { to: "/merchants/affiliates", label: "Affiliates", icon: "🤝", tier: "free" },
  { to: "/settings", label: "HQ Settings", icon: "⚙️", tier: "free" },
];

const CUSTOMER_NAV = [
  { to: "/wallet", label: "My Stamp Cards", icon: "🎟️", tier: "free" },
  { to: "/rewards", label: "Available Perks", icon: "🎁", tier: "free" },
  { to: "/history", label: "Activity Logs", icon: "🧾", tier: "free" },
  { to: "/profile", label: "My Profile", icon: "⚙️", tier: "free" },
];

export default function AppShell({
  children,
  prefix = "",
}: {
  children: React.ReactNode;
  prefix?: string;
}) {
  const { setToken, role, email, setupStatus } = useAuth();
  const { track } = useAnalytics();
  const router = useRouter();
  const pathname = usePathname() ?? "";

  // Fetch staff branch info for sidebar display
  const { data: staffMe } = useQuery<{ storeLocation: { name: string; address: string } | null }>({
    queryKey: ["staff-me"],
    queryFn: () => api.get("/staff/me"),
    enabled: role === "BUSINESS_STAFF",
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [overlayState, setOverlayState] = useState<
    "none" | "premium" | "coming-soon"
  >("none");
  const [isGuarding, setIsGuarding] = useState(true);

  // ============================================================================
  // STRICT CLIENT-SIDE CRYPTOGRAPHIC ROUTING ACCESS SECURITY GUARD
  // ============================================================================
  useEffect(() => {
    if (!role) {
      setIsGuarding(false);
      return;
    }

    const cleanPath = pathname.replace(prefix, "");

    // Fallback anchor matrices for role mismatches
    const defaultsByRole: Record<string, string> = {
      SUPER_ADMIN: "/dashboard",
      CUSTOMER: "/wallet",
      BUSINESS_OWNER: "/dashboard",
      BUSINESS_STAFF: "/dashboard",
      AFFILIATE: "/affiliate",
    };

    let isAllowed = false;

    if (role === "SUPER_ADMIN") {
      isAllowed = true;
    } else if (role === "CUSTOMER") {
      isAllowed =
        CUSTOMER_NAV.some((item) => item.to === cleanPath) ||
        cleanPath === "/wallet" ||
        cleanPath.startsWith("/wallet/card/");
    } else {
      // Default Fallback mapping validation loop for Merchant / Staff Roles
      const allowedNav = role === "BUSINESS_STAFF" ? STAFF_NAV : MERCHANT_NAV;
      isAllowed =
        Object.values(allowedNav)
          .flat()
          .some((item) => item.to === cleanPath) || cleanPath === "/dashboard";
    }

    if (!isAllowed) {
      const secureFallbackTarget = `${prefix}${defaultsByRole[role] || "/dashboard"}`;
      track("security_route_interception", {
        intercepted_path: pathname,
        assumed_role: role,
      });
      router.replace(secureFallbackTarget);
    } else {
      setIsGuarding(false);
    }
  }, [pathname, role, prefix, router, track]);

  const logout = () => {
    setToken(null);
    router.push("/login");
  };

  const renderDot = (ok: boolean) => (
    <span
      className={`size-2 rounded-full shrink-0 ${ok ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"}`}
    />
  );

  const statusDots: Record<string, React.ReactNode> = setupStatus
    ? {
        "/pos-sync": renderDot(setupStatus.hasPosLinked),
        "/security": renderDot(setupStatus.isFraudGuardActive),
      }
    : {};

  const handleItemNavigation = (item: {
    label: string;
    to: string;
    tier: string;
  }) => {
    track("feature_click", { feature: item.label, access_tier: item.tier });
    setIsMobileOpen(false);

    if (item.tier === "premium") {
      setOverlayState("premium");
      return false;
    }
    if (item.tier === "coming-soon") {
      setOverlayState("coming-soon");
      return false;
    }

    setOverlayState("none");
    return true;
  };

  const NavigationContent = () => (
    <div className="flex flex-col h-full bg-[#14100E]">
      <div className="p-6 border-b border-stone-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-amber-500 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-amber-500/10">
            ✨
          </div>
          <div>
            <div className="font-black text-stone-50 tracking-tight text-sm">
              Regulars Club
            </div>
            <div className="text-[11px] text-stone-400 font-mono font-bold uppercase tracking-wider">
              {role === "SUPER_ADMIN" && "HQ Global Admin"}
              {role === "CUSTOMER" && "Member Wallet"}
              {(role === "BUSINESS_OWNER" || role === "BUSINESS_STAFF") && "Merchant Studio"}
              {role === "BUSINESS_STAFF" && " · Staff"}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1 rounded-lg text-stone-500 hover:text-stone-300"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto space-y-6">
        <div className="px-3 py-2 rounded-xl bg-[#0C0A09]/40 border border-stone-900/60 truncate">
          <span className="block text-[9px] font-black text-stone-600 uppercase tracking-wider font-mono">
            Verified Operator Email
          </span>
          <span className="text-[11px] font-mono text-stone-400 font-bold block truncate">
            {email}
          </span>
          {role === "BUSINESS_STAFF" && (
            <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 mt-0.5 truncate">
              📍 {staffMe?.storeLocation?.name ?? "No branch assigned"}
            </span>
          )}
        </div>

        {/* CONDITIONALLY RENDER NAVIGATION GROUPS BY CURRENT CONTEXT IDENTITY */}
        {role === "SUPER_ADMIN" && (
          <NavSection
            title="HQ Central Analytics"
            items={SUPERADMIN_NAV}
            pathname={pathname}
            statusDots={{}}
            prefix={prefix}
            onNavClick={handleItemNavigation}
          />
        )}

        {role === "CUSTOMER" && (
          <NavSection
            title="My Digital Passbook"
            items={CUSTOMER_NAV}
            pathname={pathname}
            statusDots={{}}
            prefix={prefix}
            onNavClick={handleItemNavigation}
          />
        )}

        {role === "BUSINESS_OWNER" && (
          <>
            <NavSection
              title="Loyalty Engine"
              items={MERCHANT_NAV.main}
              pathname={pathname}
              statusDots={{}}
              prefix={prefix}
              onNavClick={handleItemNavigation}
            />
            <NavSection
              title="Store Operations"
              items={MERCHANT_NAV.operations}
              pathname={pathname}
              statusDots={statusDots}
              prefix={prefix}
              onNavClick={handleItemNavigation}
            />
            <NavSection
              title="Growth Suite"
              items={MERCHANT_NAV.business}
              pathname={pathname}
              statusDots={statusDots}
              prefix={prefix}
              onNavClick={handleItemNavigation}
            />
            <NavSection
              title="System Preferences"
              items={MERCHANT_NAV.system}
              pathname={pathname}
              statusDots={statusDots}
              prefix={prefix}
              onNavClick={handleItemNavigation}
            />
          </>
        )}

        {role === "BUSINESS_STAFF" && (
          <>
            <NavSection
              title="Loyalty Engine"
              items={STAFF_NAV.main}
              pathname={pathname}
              statusDots={{}}
              prefix={prefix}
              onNavClick={handleItemNavigation}
            />
            <NavSection
              title="Store Operations"
              items={STAFF_NAV.operations}
              pathname={pathname}
              statusDots={statusDots}
              prefix={prefix}
              onNavClick={handleItemNavigation}
            />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-stone-900">
        <button
          onClick={logout}
          aria-label="Sign out"
          className="w-full h-10 px-4 rounded-xl bg-[#1C1613] border border-stone-900 hover:bg-[#261E1A] text-stone-300 hover:text-stone-100 font-bold text-xs flex items-center gap-2.5 transition-all"
        >
          <span>🚪</span>
          <span>Disconnect Session</span>
        </button>
      </div>
    </div>
  );

  if (isGuarding) {
    return (
      <div className="w-screen h-screen bg-[#0C0A09] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-7 text-amber-500 animate-spin stroke-[1.5]" />
        <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest animate-pulse">
          Validating Security Layers...
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0C0A09] text-stone-200 antialiased selection:bg-amber-500/20 selection:text-amber-200">
      <aside className="hidden lg:block w-[260px] shrink-0 border-r border-stone-900 z-30">
        <NavigationContent />
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-[280px] border-r border-stone-900 transform transition-transform duration-300 ease-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <NavigationContent />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-14 lg:hidden border-b border-stone-900 bg-[#14100E] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-7 bg-amber-500 rounded-lg flex items-center justify-center text-xs">
              ✨
            </div>
            <span className="font-black text-xs text-stone-100 tracking-tight">
              Regulars Club
            </span>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl border border-stone-800 bg-[#0C0A09] text-stone-400 hover:text-stone-200 transition-all"
            aria-label="Open system navigation menu"
          >
            <Menu className="size-4" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {overlayState === "none" && children}

          {/* ACCESS MATRIX LEVEL MONETIZATION CHECK INTERCEPT OVERLAYS */}
          {overlayState === "premium" && (
            <UpgradePremiumOverlay onClose={() => setOverlayState("none")} />
          )}
          {overlayState === "coming-soon" && (
            <ComingSoonOverlay onClose={() => setOverlayState("none")} />
          )}
        </main>
      </div>
    </div>
  );
}

interface NavItem {
  to: string;
  label: string;
  icon: string;
  tier: string;
}

function NavSection({
  title,
  items,
  pathname,
  statusDots,
  prefix,
  onNavClick,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  statusDots: Record<string, React.ReactNode>;
  prefix: string;
  onNavClick: (item: NavItem) => boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-black font-mono text-stone-600 uppercase tracking-widest pl-3 mb-2">
        {title}
      </div>
      {items.map((item) => {
        const href = `${prefix}${item.to}`;
        const isActive = pathname === href;
        const isPremiumGated = item.tier === "premium";
        const isComingSoon = item.tier === "coming-soon";

        return (
          <Link
            key={item.to}
            href={isPremiumGated || isComingSoon ? "" : href}
            aria-label={item.label}
            onClick={(e) => {
              const proceed = onNavClick(item);
              if (!proceed) e.preventDefault();
            }}
            className={`w-full group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              isActive
                ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                : "bg-transparent border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/40"
            }`}
          >
            <span
              className={`text-base transition-transform group-hover:scale-110 duration-200 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
            >
              {item.icon}
            </span>
            <span className="flex-1 tracking-tight">{item.label}</span>
            {isPremiumGated && (
              <span className="text-[8px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]">
                Pro
              </span>
            )}
            {isComingSoon && (
              <span className="text-[8px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-500">
                Labs
              </span>
            )}
            {statusDots[href]}
          </Link>
        );
      })}
    </div>
  );
}
