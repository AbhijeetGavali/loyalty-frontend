"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/appContext";
import { useAnalytics } from "@/lib/analytics";
import { api } from "@/lib/api";
import AppShell from "@/components/AppShell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, role, setToken, setSetupStatus } = useApp();
  const { track } = useAnalytics();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (!token && !localToken) {
      router.replace("/login");
    } else if (!token && localToken) {
      setToken(localToken);
    }
    track("page_view", { page: pathname });
  }, [token, router, pathname, setToken, track]);

  // Hydrate setupStatus for merchant roles
  useEffect(() => {
    if (!token || !role) return;
    if (role !== "BUSINESS_OWNER" && role !== "BUSINESS_STAFF") return;
    api.get<{ hasWa: boolean; hasRzp: boolean; isFraudGuardActive: boolean; hasPosLinked: boolean }>(
      "/business/setup-status"
    ).then((data) => setSetupStatus(data)).catch(() => {});
  }, [token, role, setSetupStatus]);

  if (!token) return <>Loading Token</>;

  return <AppShell>{children}</AppShell>;
}
