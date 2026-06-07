"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare, Send, Clock, CheckCheck, XCircle,
  Loader2, Users, AlertTriangle, Mail, ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/appContext";

// ── Types ──────────────────────────────────────────────────────────────────────
interface WaStatus { configured: boolean }
interface WaMessage {
  id: string;
  toPhone: string;
  templateName: string;
  text: string | null;
  status: string;
  sentAt: string;
  msgType: string;
}

// ── Not-setup overlay ──────────────────────────────────────────────────────────
function NotSetupOverlay() {
  return (
    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-[#0C0A09]/80 rounded-2xl flex flex-col items-center justify-center text-center p-8 gap-5">
      <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <MessageSquare className="size-6 text-amber-400" />
      </div>
      <div>
        <p className="text-base font-black text-stone-100">WhatsApp not configured</p>
        <p className="text-xs text-stone-400 mt-1.5 max-w-xs leading-relaxed">
          WhatsApp broadcasting requires setup by our team. Contact us to get your business connected.
        </p>
      </div>
      <a
        href="mailto:contact@ideasprout.in?subject=WhatsApp%20Setup%20Request"
        className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl transition-all"
      >
        <Mail className="size-4" />
        Contact us at contact@ideasprout.in
      </a>
      <p className="text-[10px] text-stone-600">
        We'll configure your Meta WhatsApp Business API credentials within 24 hours.
      </p>
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    delivered: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    read:      "text-blue-400 bg-blue-500/10 border-blue-500/20",
    failed:    "text-red-400 bg-red-500/10 border-red-500/20",
    pending:   "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${map[status] ?? "text-stone-500 bg-stone-800 border-stone-700"}`}>
      {status}
    </span>
  );
}

const SEGMENTS = [
  { value: "all",      label: "All Customers",     desc: "Every customer with a loyalty card" },
  { value: "at_risk",  label: "At Risk",            desc: "No visit in 30–90 days" },
  { value: "loyal",    label: "Loyal",              desc: "Regular, consistent visitors" },
  { value: "champion", label: "Champions",          desc: "High-frequency, high-stamp customers" },
  { value: "new",      label: "New Customers",      desc: "Joined but never stamped" },
] as const;

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SMSMarketingPage() {
  const { role } = useApp();
  const isOwner = role === "BUSINESS_OWNER";
  const toast = useToast();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [segment, setSegment] = useState<typeof SEGMENTS[number]["value"]>("all");
  const [tab, setTab] = useState<"broadcast" | "history">("broadcast");

  const { data: status, isLoading: loadingStatus } = useQuery<WaStatus>({
    queryKey: ["wa-status"],
    queryFn: () => api.get<WaStatus>("/business/wa-status"),
  });

  const { data: messages = [], isLoading: loadingMessages } = useQuery<WaMessage[]>({
    queryKey: ["wa-messages"],
    queryFn: () => api.get<WaMessage[]>("/business/wa-messages"),
    enabled: tab === "history",
  });

  const broadcastMutation = useMutation({
    mutationFn: (body: { message: string; segment: string }) =>
      api.post<{ sent: number; failed: number; total: number }>("/business/broadcast", body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wa-messages"] });
      toast.success(`Sent to ${data.sent} customers. ${data.failed > 0 ? `${data.failed} failed (no phone).` : ""}`);
      setMessage("");
    },
    onError: (err: any) => toast.error(err.message || "Broadcast failed."),
  });

  const configured = status?.configured ?? false;
  const selectedSegment = SEGMENTS.find(s => s.value === segment)!;

  return (
    <div className="space-y-8 animate-fade-in text-stone-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50 flex items-center gap-3">
            <MessageSquare className="size-7 text-amber-500 shrink-0" />
            WhatsApp Marketing
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Send targeted WhatsApp messages to your customer segments.
          </p>
        </div>
        {!loadingStatus && (
          <div className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl border self-start ${
            configured
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-rose-400 bg-rose-500/10 border-rose-500/20"
          }`}>
            <span className={`size-1.5 rounded-full ${configured ? "bg-emerald-400" : "bg-rose-400"}`} />
            {configured ? "WhatsApp Connected" : "Not Configured"}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#14100E] border border-stone-800 rounded-xl w-fit">
        {[
          { key: "broadcast", label: "Broadcast", icon: Send },
          { key: "history",   label: "Message History", icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${tab === key ? "bg-[#0C0A09] text-amber-400 border border-stone-900" : "text-stone-500 hover:text-stone-300"}`}>
            <Icon className="size-3" /> {label}
          </button>
        ))}
      </div>

      {/* ── Broadcast Tab ── */}
      {tab === "broadcast" && (
        <div className="relative">
          {!loadingStatus && !configured && <NotSetupOverlay />}

          <div className={`space-y-5 ${!configured ? "pointer-events-none select-none" : ""}`}>
            {/* Staff view — read-only notice */}
            {!isOwner && configured && (
              <div className="flex items-start gap-3 p-4 bg-stone-900/40 border border-stone-800 rounded-xl">
                <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-stone-400">Broadcast is restricted to the business owner. Switch to History to see sent messages.</p>
              </div>
            )}

            {isOwner && (
              <Card className="border-stone-800/80 bg-[#14100E] rounded-2xl p-6 space-y-5">
                {/* Segment selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Target Segment</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SEGMENTS.map(s => (
                      <button key={s.value} onClick={() => setSegment(s.value)}
                        className={`p-3 rounded-xl border text-left transition-all ${segment === s.value ? "border-amber-500/40 bg-amber-500/5" : "border-stone-800 bg-stone-900/40 hover:border-stone-700"}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <Users className={`size-3 ${segment === s.value ? "text-amber-400" : "text-stone-600"}`} />
                          <p className={`text-[11px] font-black ${segment === s.value ? "text-amber-400" : "text-stone-300"}`}>{s.label}</p>
                        </div>
                        <p className="text-[9px] text-stone-600 leading-tight">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message composer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Message</label>
                    <span className={`text-[10px] font-mono ${message.length > 900 ? "text-red-400" : "text-stone-600"}`}>{message.length}/1000</span>
                  </div>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    placeholder={`Write your message to ${selectedSegment.label.toLowerCase()}...`}
                    className="w-full px-4 py-3 bg-[#0C0A09] border border-stone-800 rounded-xl text-stone-100 text-sm resize-none focus:outline-none focus:border-amber-500/50 placeholder:text-stone-600"
                  />
                  <p className="text-[9px] text-stone-600">Messages are sent as plain WhatsApp text. Only customers with a registered phone number will receive them.</p>
                </div>

                <button
                  onClick={() => broadcastMutation.mutate({ message, segment })}
                  disabled={!message.trim() || broadcastMutation.isPending}
                  className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {broadcastMutation.isPending
                    ? <><Loader2 className="size-4 animate-spin" /> Sending...</>
                    : <><Send className="size-4" /> Send to {selectedSegment.label}</>}
                </button>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ── History Tab ── */}
      {tab === "history" && (
        <div className="space-y-4">
          {loadingMessages && (
            <div className="py-12 flex justify-center"><Loader2 className="size-5 animate-spin text-amber-500" /></div>
          )}

          {!loadingMessages && messages.length === 0 && (
            <div className="py-16 border border-dashed border-stone-800 rounded-2xl text-center">
              <MessageSquare className="size-7 text-stone-700 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-400">No messages sent yet.</p>
            </div>
          )}

          {!loadingMessages && messages.length > 0 && (
            <div className="bg-[#14100E] border border-stone-800/80 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-900 flex items-center gap-2">
                <Clock className="size-4 text-amber-500" />
                <p className="text-xs font-black text-stone-100">Sent Messages</p>
                <span className="ml-auto text-[9px] text-stone-600 font-mono">{messages.length} total</span>
              </div>
              <div className="divide-y divide-stone-900/50">
                {messages.map(msg => (
                  <div key={msg.id} className="px-5 py-3.5 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-mono text-stone-400">{msg.toPhone}</span>
                        <StatusBadge status={msg.status} />
                        {msg.templateName && msg.templateName !== "" && (
                          <span className="text-[9px] text-stone-600 border border-stone-800 px-1 rounded">{msg.templateName}</span>
                        )}
                      </div>
                      {msg.text && (
                        <p className="text-xs text-stone-400 truncate max-w-md">{msg.text}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-stone-600 shrink-0">
                      {new Date(msg.sentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
