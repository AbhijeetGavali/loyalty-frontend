"use client";
import { useEffect, useState } from "react";
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
  console.log({
    token,
    localStorageToken:
      typeof window !== "undefined" ? localStorage.getItem("token") : null,
  });
  useEffect(() => {
    let localToken = localStorage.getItem("token");
    if (!token && !localToken) {
      router.replace("/login");
    } else if (!token && localToken) {
      console.log("Restoring token from localStorage", localToken);
      setToken(localToken);
    }
    track("page_view", { page: pathname });
  }, [token, router]);

  // 2. If finished loading but no token found, block rendering while redirect kicks in
  if (!token) return <>Loading Token</>;

  // 3. Authenticated state reached successfully
  return <AppShell>{children}</AppShell>;
}
