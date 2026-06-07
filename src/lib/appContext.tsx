"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { setAuthState } from "./api";

// ── 3 states ──────────────────────────────────────────────────────────────────
export type AppMode = "authed" | "guest";

interface AppCtx {
  mode: AppMode;
  // Auth fields (only meaningful when mode === 'authed')
  token: string | null;
  role: "BUSINESS_OWNER" | "CUSTOMER" | "SUPERADMIN" | "BUSINESS_STAFF" | null;
  userId: string | null;
  email: string;
  setupStatus: {
    hasWa: boolean;
    hasRzp: boolean;
    isFraudGuardActive: boolean;
    hasPosLinked: boolean;
  } | null;
  setToken: (
    t: string | null,
    role?:
      | "BUSINESS_OWNER"
      | "CUSTOMER"
      | "SUPERADMIN"
      | "BUSINESS_STAFF"
      | null,
    userId?: string,
    email?: string,
  ) => void;
  hasPosLinked: boolean;
  isFraudGuardActive: boolean;
}

const Ctx = createContext<AppCtx>({
  mode: "guest",
  token: null,
  role: null,
  userId: null,
  email: "User",
  setupStatus: null,
  setToken: () => {},
  hasPosLinked: false,
  isFraudGuardActive: false,
});

export const useApp = () => useContext(Ctx);
// Backwards-compat aliases so existing code keeps working without mass-rename
export const useAuth = useApp;

function parseJwt(
  token: string,
): { role?: string; id?: string; email?: string } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRole] = useState<AppCtx["role"] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("User");
  const [setupStatus, setSetupStatus] = useState<AppCtx["setupStatus"]>(null);

  // ── Derived mode ────────────────────────────────────────────────────────────
  const mode: AppMode = token ? "authed" : "guest";

  // ── Hydrate from localStorage on mount ─────────────────────────────────────
  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (t) {
      setTokenState(t);
      const p = parseJwt(t);
      setRole((p?.role as AppCtx["role"]) ?? null);
      setUserId(p?.id ?? null);
      setEmail(p?.email ?? "User");
      setAuthState(true);
    }
  }, []);

  // ── Sync auth state to api.ts ───────────────────────────────────────────────
  useEffect(() => {
    setAuthState(!!token);
  }, [token]);

  // ── setToken (login / logout) ───────────────────────────────────────────────
  const setToken = useCallback(
    (
      t: string | null,
      r?: AppCtx["role"] | null,
      uid?: string,
      e?: string,
    ) => {
      console.log("Setting token, parsed payload:", t);
      if (t) {
        const p = parseJwt(t);
        setTokenState(t);
        setRole(r ?? (p?.role as AppCtx["role"]) ?? null);
        setUserId(uid ?? p?.id ?? null);
        setEmail(e ?? p?.email ?? "User");
        localStorage.setItem("token", t);
      } else {
        setTokenState(null);
        setRole(null);
        setUserId(null);
        setEmail("User");
        setSetupStatus(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },
    [],
  );

  return (
    <Ctx.Provider
      value={{
        mode,
        token,
        role,
        userId,
        email,
        setupStatus,
        setToken,
        hasPosLinked: setupStatus?.hasPosLinked ?? false,
        isFraudGuardActive: setupStatus?.isFraudGuardActive ?? false,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
