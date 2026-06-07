"use client";

import { useApp } from "@/lib/appContext";
import { ShieldOff } from "lucide-react";

export default function OwnerOnlyGuard({ children }: { children: React.ReactNode }) {
  const { role } = useApp();

  if (role === "BUSINESS_STAFF") {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-4">
        <div className="size-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <ShieldOff className="size-6 text-rose-400" />
        </div>
        <div>
          <p className="text-sm font-black text-stone-200">Access Restricted</p>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            This section is only accessible to the business owner.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
