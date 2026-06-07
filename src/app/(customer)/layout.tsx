"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/appContext";
import AppShell from "@/components/AppShell";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useApp();
  const router = useRouter();

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !stored) router.replace("/customer-login");
  }, [token, router]);

  if (!token) return null;
  return <AppShell>{children}</AppShell>;
}
