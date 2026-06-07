"use client";

import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Monitor, QrCode, Loader2, Copy, ExternalLink, Download, Maximize2, X, Pencil, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useApp } from "@/lib/appContext";

export default function CounterDisplaysPage() {
  const [fullscreen, setFullscreen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { role } = useApp();

  const { data: qrData, isLoading } = useQuery<{ businessId: string; onboardingUrl: string }>({
    queryKey: ["qr-info"],
    queryFn: () => api.get("/qr/me"),
  });

  const { data: staffMe } = useQuery<{ storeLocation: { name: string; address: string; phone?: string } | null }>({
    queryKey: ["staff-me"],
    queryFn: () => api.get("/staff/me"),
    enabled: role === "BUSINESS_STAFF",
  });

  const qrImageUrl = qrData?.onboardingUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData.onboardingUrl)}`
    : null;

  const copyUrl = () => {
    if (qrData?.onboardingUrl) navigator.clipboard.writeText(qrData.onboardingUrl);
  };

  const download = async () => {
    if (!qrImageUrl) return;
    const res = await fetch(qrImageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loyalty-qr.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openEditor = () => {
    if (!qrData?.onboardingUrl) return;
    window.open(`https://qr.ideasprout.in/?url=${encodeURIComponent(qrData.onboardingUrl)}`, "_blank");
  };

  return (
    <>
      {/* Fullscreen overlay */}
      {fullscreen && qrImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            onClick={() => setFullscreen(false)}
          >
            <X className="size-7" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt="Loyalty QR Code"
            className="max-w-[90vmin] max-h-[90vmin] rounded-2xl bg-white p-4"
          />
          {role === "BUSINESS_STAFF" && staffMe?.storeLocation && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 border border-amber-500/30 rounded-xl px-4 py-2 backdrop-blur-sm">
              <MapPin className="size-4 text-amber-400 shrink-0" />
              <div className="text-center">
                <p className="text-sm font-black text-amber-300">{staffMe.storeLocation.name}</p>
                <p className="text-[11px] text-stone-400">{staffMe.storeLocation.address}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">Counter Displays</h1>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">Share your QR code so customers can join your loyalty program.</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="max-w-lg space-y-5">
            <Card className="border-stone-800 bg-[#14100E] rounded-2xl p-8 flex flex-col items-center gap-6">
              <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center">
                <QrCode className="size-5 text-amber-400" />
              </div>

              {qrImageUrl && (
                <div className="relative group bg-white p-4 rounded-2xl shadow-lg cursor-pointer" onClick={() => setFullscreen(true)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={qrImageUrl}
                    alt="Loyalty QR Code"
                    width={200}
                    height={200}
                    className="block"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <Maximize2 className="size-6 text-transparent group-hover:text-stone-700 transition-all" />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={download}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-bold text-stone-300 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                >
                  <Download className="size-3.5" /> Download
                </button>
                <button
                  onClick={openEditor}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-bold text-stone-300 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                >
                  <Pencil className="size-3.5" /> Customise QR
                </button>
                <button
                  onClick={() => setFullscreen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-bold text-stone-300 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                >
                  <Maximize2 className="size-3.5" /> Fullscreen
                </button>
              </div>

              <div className="w-full space-y-2 text-center">
                <p className="text-xs text-stone-400 font-medium">Customer scan link</p>
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2">
                  <p className="text-[11px] font-mono text-stone-400 truncate flex-1">{qrData?.onboardingUrl}</p>
                  <button onClick={copyUrl} className="text-stone-500 hover:text-amber-400 transition-colors shrink-0">
                    <Copy className="size-3.5" />
                  </button>
                  <a href={qrData?.onboardingUrl} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-amber-400 transition-colors shrink-0">
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Branch info for staff */}
            {role === "BUSINESS_STAFF" && (
              <Card className="border-amber-500/20 bg-amber-500/5 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-amber-400" />
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">Your Branch</h3>
                </div>
                {staffMe?.storeLocation ? (
                  <div className="space-y-1">
                    <p className="text-sm font-black text-stone-100">{staffMe.storeLocation.name}</p>
                    <p className="text-xs text-stone-400">{staffMe.storeLocation.address}</p>
                    {staffMe.storeLocation.phone && (
                      <p className="text-xs text-stone-500">{staffMe.storeLocation.phone}</p>
                    )}
                    <p className="text-[10px] text-stone-600 mt-2">
                      Customers scanning this QR should select <span className="text-amber-400 font-bold">"{staffMe.storeLocation.name}"</span> when requesting a stamp.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">No branch assigned. Contact your manager.</p>
                )}
              </Card>
            )}

            <Card className="border-stone-800/60 bg-[#14100E] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-stone-500" />
                <h3 className="text-xs font-black text-stone-300 uppercase tracking-wider">How to use</h3>
              </div>
              <ol className="space-y-2 text-xs text-stone-500 list-decimal list-inside">
                <li>Print or display this QR code at your counter.</li>
                <li>Customers scan it with their phone camera.</li>
                <li>They create a loyalty card for your café instantly.</li>
                <li>They show the invoice number from each purchase to earn stamps.</li>
              </ol>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
