"use client";

export const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Public endpoints that are allowed without auth or demo mode
const PUBLIC_PATHS = ["/auth/", "/public/", "/cards"];

const isPublicPath = (path: string) =>
  PUBLIC_PATHS.some((p) => path.startsWith(p));

// Auth state: set by AppProvider so api.ts knows if user is authenticated
let _isAuthed = false;
export function setAuthState(authed: boolean) {
  _isAuthed = authed;
}

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: Error) => void;
}> = [];

function drainQueue(token: string | null, err: Error | null) {
  refreshQueue.forEach(({ resolve, reject }) =>
    token ? resolve(token) : reject(err!),
  );
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  const payload = data.data ?? data;
  localStorage.setItem("token", payload.accessToken);
  if (payload.refreshToken)
    localStorage.setItem("refreshToken", payload.refreshToken);
  return payload.accessToken;
}

async function getValidToken(): Promise<string> {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const token = await refreshAccessToken();
      drainQueue(token, null);
      return token;
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Session expired");
      drainQueue(null, e);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      throw e;
    } finally {
      isRefreshing = false;
    }
  }
  return new Promise<string>((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Guest mode: block all non-public API calls silently
  if (!_isAuthed && !isPublicPath(path)) throw new Error("Not authenticated");

  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string>),
  };

  let res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401 && !path.startsWith("/auth/")) {
    const newToken = await getValidToken();
    headers["Authorization"] = `Bearer ${newToken}`;
    res = await fetch(`${BASE}${path}`, { ...init, headers });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    let msg: string = err.error?.message ?? err.message ?? "Request failed";
    try {
      const parsed = JSON.parse(msg);
      if (Array.isArray(parsed))
        msg = parsed
          .map((e: any) => e.message)
          .filter(Boolean)
          .join(", ");
      else if (parsed.message) msg = parsed;
    } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  if (data.success === false) {
    throw new Error(data.error?.message || "Request failed");
  }
  return data.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
