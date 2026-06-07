"use client";

import React, { useState } from "react";
import OwnerOnlyGuard from "@/components/OwnerOnlyGuard";
import {
  Cpu,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Link2,
  Radio,
  Terminal,
  Search,
  SlidersHorizontal,
  Code,
  Layers,
  ArrowUpRight,
  Server,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Comprehensive mock data ledger containing point of sale telemetry matrix shapes
const STATIC_POS_CONNECTORS = [
  {
    id: "pos_node_301",
    hardwareName: "Toast POS Terminal - Alpha",
    location: "Downtown Headquarters - Front Register",
    apiEnvironment: "Production (Main)",
    latency: "14ms",
    syncedCampaigns: 3,
    status: "connected",
    webhookUrl: "https://api.regulars.club/v1/hooks/toast-main",
    softwareVersion: "v4.12.2",
  },
  {
    id: "pos_node_304",
    hardwareName: "Square Register Stand",
    location: "Northside Sub-Branch - Main Pod",
    apiEnvironment: "Production (Main)",
    latency: "28ms",
    syncedCampaigns: 2,
    status: "connected",
    webhookUrl: "https://api.regulars.club/v1/hooks/square-north",
    softwareVersion: "v2.8.0",
  },
  {
    id: "pos_node_309",
    hardwareName: "Clover Flex Handheld",
    location: "Downtown Headquarters - Mobile Patio",
    apiEnvironment: "Sandbox Testing",
    latency: "310ms",
    syncedCampaigns: 1,
    status: "degradation",
    webhookUrl: "https://api.staging.regulars.club/hooks/clover-dev",
    softwareVersion: "v5.0.0-beta3",
  },
  {
    id: "pos_node_312",
    hardwareName: "Legacy Micros WS6 Gateway",
    location: "Waterfront Pop-up Node",
    apiEnvironment: "Production (Main)",
    latency: "Offline",
    syncedCampaigns: 0,
    status: "disconnected",
    webhookUrl: "https://api.regulars.club/v1/hooks/micros-legacy",
    softwareVersion: "v1.0.4",
  },
  {
    id: "pos_node_322",
    hardwareName: "Lightspeed K-Series Core",
    location: "Eastside Roastery Hub - Coffee Bar",
    apiEnvironment: "Production (Main)",
    latency: "19ms",
    syncedCampaigns: 4,
    status: "connected",
    webhookUrl: "https://api.regulars.club/v1/hooks/lightspeed-east",
    softwareVersion: "v3.1.0",
  },
];

export default function PosIntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "connected" | "disconnected"
  >("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic feedback loop simulating instant infrastructure diagnostics ping
  const triggerLivePing = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  };

  // Pure processing compute layer running over static object payloads
  const filteredNodes = STATIC_POS_CONNECTORS.filter((node) => {
    const matchesSearch =
      node.hardwareName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "connected" &&
        (node.status === "connected" || node.status === "degradation")) ||
      (statusFilter === "disconnected" && node.status === "disconnected");

    return matchesSearch && matchesStatus;
  });

  // Derived metrics calculations from active state
  const activeCount = STATIC_POS_CONNECTORS.filter(
    (n) => n.status === "connected" || n.status === "degradation",
  ).length;
  const degradationCount = STATIC_POS_CONNECTORS.filter(
    (n) => n.status === "degradation",
  ).length;

  return (
    <OwnerOnlyGuard>
    <div className="space-y-8 animate-fade-in text-stone-200">
      {/* SECTION VIEWPORT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50 flex items-center gap-3">
            <Cpu className="size-7 text-amber-500 shrink-0" />
            POS Integrations
          </h1>
          <p className="text-xs text-stone-500 font-medium leading-relaxed">
            Link physical cash registers, monitor transactional API endpoints,
            provision listener webhooks, and map checkout hardware to campaigns.
          </p>
        </div>

        {/* PRIMARY CTA HUB BUTTONS */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <Button
            onClick={triggerLivePing}
            variant="outline"
            className="h-10 px-3 rounded-xl bg-[#14100E] border-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-900/40 text-xs gap-2"
          >
            <RefreshCw
              className={`size-3.5 ${isRefreshing ? "animate-spin text-amber-500" : ""}`}
            />
            Ping Hardware Nodes
          </Button>

          <Button
            onClick={() => {}}
            className="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs gap-2 shadow-lg shadow-amber-500/10 transition-all active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            Provision Connector
          </Button>
        </div>
      </div>

      {/* CORE OPERATIONAL DIAGNOSTICS HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#14100E] border border-stone-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <span className="block text-[9px] font-bold text-stone-600 uppercase tracking-wider">
              Connected Pipeline Edge
            </span>
            <span className="text-xs font-black text-stone-200 block mt-0.5">
              {activeCount} of {STATIC_POS_CONNECTORS.length} Gateways
              Operational
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#14100E] border border-stone-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="size-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-sm">
            <Activity className="size-4" />
          </div>
          <div>
            <span className="block text-[9px] font-bold text-stone-600 uppercase tracking-wider">
              Network Health Latency
            </span>
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 mt-0.5">
              {degradationCount > 0
                ? "1 Node High Latency Jitter"
                : "All Core Routes Optimized"}
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#14100E] border border-stone-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="size-9 rounded-xl bg-stone-900 text-stone-500 flex items-center justify-center border border-stone-800/60 shadow-inner">
            <Server className="size-4 text-stone-400" />
          </div>
          <div>
            <span className="block text-[9px] font-bold text-stone-600 uppercase tracking-wider">
              Cryptographic Protocol
            </span>
            <span className="text-xs font-black text-stone-400 block mt-0.5">
              HMAC-SHA256 Webhook Signing
            </span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL BAR CONTAINER */}
      <div className="p-4 bg-[#14100E] border border-stone-800/80 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        {/* SEARCH CONSOLE INPUT */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-600" />
          <Input
            placeholder="Search active integration links by hardware name, localized store, or Node ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 rounded-xl bg-[#0C0A09] border-stone-800/80 focus-visible:ring-amber-500 text-stone-100 placeholder:text-stone-600 text-xs w-full"
          />
        </div>

        {/* CONNECTION STATE CONTROL FILTER MATRICES */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {(["all", "connected", "disconnected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`h-9 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                statusFilter === status
                  ? "bg-amber-500 border-amber-500 text-stone-950 shadow-md shadow-amber-500/10"
                  : "bg-[#0C0A09] border-stone-800/80 text-stone-500 hover:text-stone-300"
              }`}
            >
              {status === "all" ? "All Endpoints" : `${status} links`}
            </button>
          ))}
        </div>
      </div>

      {/* INTEGRATIONS MATRIX GRID INDEX */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredNodes.map((node) => {
          const isConnected = node.status === "connected";
          const isDegraded = node.status === "degradation";
          const isDisconnected = node.status === "disconnected";

          return (
            <Card
              key={node.id}
              className="border-stone-800/80 bg-[#14100E] rounded-2xl shadow-none relative overflow-hidden group flex flex-col justify-between hover:border-stone-700 transition-all"
            >
              <div className="p-6 space-y-5">
                {/* NODE HEADER STATUS AND LABELS */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-stone-600 text-[10px]">
                        {node.id}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                          node.apiEnvironment.includes("Production")
                            ? "bg-amber-500/5 text-amber-500/80 border-amber-500/10"
                            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        }`}
                      >
                        {node.apiEnvironment}
                      </span>
                    </div>
                    <h3 className="font-black text-stone-100 group-hover:text-amber-400 transition-colors tracking-tight text-base truncate">
                      {node.hardwareName}
                    </h3>
                  </div>

                  {/* ACTIVE PIPELINE TELEMETRY DOT BADGE */}
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-mono font-black tracking-widest uppercase shrink-0 flex items-center gap-1 border ${
                      isConnected
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                        : isDegraded
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                          : "bg-stone-900 text-stone-500 border-stone-800"
                    }`}
                  >
                    <div
                      className={`size-1 rounded-full ${
                        isConnected
                          ? "bg-emerald-400"
                          : isDegraded
                            ? "bg-amber-400"
                            : "bg-stone-600"
                      }`}
                    />
                    {node.status}
                  </span>
                </div>

                {/* WEBHOOK URL STRIP DATA FIELD */}
                <div className="space-y-1.5">
                  <span className="text-[8px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1 font-mono">
                    <Link2 className="size-2.5 text-stone-600" /> Live Endpoint
                    Intervector Target
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#0C0A09] border border-stone-900 font-mono text-[11px] text-stone-400 truncate select-all cursor-pointer hover:text-stone-300 transition-colors">
                    {node.webhookUrl}
                  </div>
                </div>

                {/* TELEMETRY PACKET DIAGNOSTICS PERFORMANCE GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0C0A09]/60 border border-stone-900/80 text-xs">
                  <div className="space-y-0.5">
                    <span className="block text-[8px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Radio className="size-2.5 text-stone-600" /> Handshake
                      Ping
                    </span>
                    <span
                      className={`font-black block text-sm tracking-tight ${isDisconnected ? "text-rose-500" : isDegraded ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {node.latency}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="block text-[8px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Layers className="size-2.5 text-stone-600" /> Linked
                      Targets
                    </span>
                    <span className="font-bold text-stone-200 block text-sm tracking-tight">
                      {node.syncedCampaigns} Campaigns
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="block text-[8px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Terminal className="size-2.5 text-stone-600" /> Client
                      Driver Build
                    </span>
                    <span className="font-mono text-stone-400 font-bold block text-xs pt-0.5">
                      {node.softwareVersion}
                    </span>
                  </div>
                </div>

                {/* HARDWARE SPATIAL LOCATION MAPPING FOOTER */}
                <div className="text-[11px] font-semibold text-stone-500 border-t border-stone-900/60 pt-3">
                  Physical Node Deployment Perimeter:{" "}
                  <span className="text-stone-300 font-bold ml-1">
                    {node.location}
                  </span>
                </div>
              </div>

              {/* REGISTER SYSTEM SETTING CONTROLS STRIP */}
              <div className="px-6 py-3.5 bg-[#0F0B0A] border-t border-stone-900 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs font-bold">
                <button
                  onClick={() => {}}
                  className="text-stone-500 hover:text-stone-300 flex items-center gap-1.5 transition-colors group/edit self-start"
                >
                  <Code className="size-3.5 text-stone-600 group-hover/edit:text-stone-400 transition-colors" />
                  <span>Inspect API Payloads</span>
                </button>

                <button
                  onClick={() => {}}
                  className="text-stone-500 hover:text-amber-500 transition-colors flex items-center gap-1 self-end sm:self-auto"
                >
                  <span>Reconfigure Integration Parameters</span>
                  <ArrowUpRight className="size-3 text-stone-600" />
                </button>
              </div>
            </Card>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className="col-span-full py-16 border border-dashed border-stone-800/80 rounded-2xl flex flex-col items-center justify-center text-center">
            <SlidersHorizontal className="size-6 text-stone-700 mb-2" />
            <span className="text-xs font-bold text-stone-400">
              No Hardware Modules Discovered
            </span>
            <p className="text-[10px] text-stone-600 mt-0.5">
              No point of sale configurations respond to the provided parameter
              constraints.
            </p>
          </div>
        )}
      </div>
    </div>
    </OwnerOnlyGuard>
  );
}
