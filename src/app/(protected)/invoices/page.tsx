"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Invoice {
  id: string;
  invoiceNumber: string;
  purchaseAmount: number;
  createdAt: string;
}

export default function InvoicesPage() {
  const { data: invoices = [], isLoading, isError } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: () => api.get<Invoice[]>("/invoice"),
  });

  const total = invoices.reduce((sum, inv) => sum + inv.purchaseAmount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Invoices</h1>
          <p className="text-xs text-stone-500 mt-0.5">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""} · ₹{total.toLocaleString("en-IN")} total</p>
        </div>
      </div>

      {isLoading && <div className="py-16 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-amber-500" /></div>}
      {isError && <div className="py-16 text-center text-rose-400 text-sm">Failed to load invoices.</div>}
      {!isLoading && !isError && invoices.length === 0 && (
        <div className="py-16 border border-dashed border-stone-800 rounded-2xl text-center">
          <FileText className="size-8 text-stone-700 mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-400">No invoices yet</p>
          <p className="text-[10px] text-stone-600 mt-0.5">Invoices are created when customers request stamps.</p>
        </div>
      )}

      {!isLoading && !isError && invoices.length > 0 && (
        <div className="rounded-2xl border border-stone-800 overflow-hidden">
          <div className="grid grid-cols-3 px-4 py-2.5 bg-stone-900/50 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
            <span>Invoice #</span>
            <span className="text-center">Date</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="divide-y divide-stone-900">
            {invoices.map((inv) => (
              <div key={inv.id} className="grid grid-cols-3 px-4 py-3 hover:bg-stone-900/30 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="size-3.5 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold text-stone-200 font-mono">{inv.invoiceNumber}</span>
                </div>
                <span className="text-xs text-stone-400 text-center self-center">
                  {new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
                <span className="text-xs font-black text-amber-400 text-right self-center">
                  ₹{inv.purchaseAmount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
