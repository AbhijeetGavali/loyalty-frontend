"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/appContext";
import { useAnalytics } from "@/lib/analytics";
import AppShell from "@/components/AppShell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, setToken } = useApp();
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

  if (!token) return <>Loading Token</>;

  return <AppShell>{children}</AppShell>;
}
