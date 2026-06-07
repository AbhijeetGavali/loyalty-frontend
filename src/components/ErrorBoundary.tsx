"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen bg-[#0C0A09] flex flex-col items-center justify-center gap-4 px-4">
            <div className="size-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <h2 className="text-lg font-black text-stone-100">Something went wrong</h2>
            <p className="text-xs text-stone-500 text-center max-w-xs">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="text-xs text-amber-500 underline hover:text-amber-400"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
