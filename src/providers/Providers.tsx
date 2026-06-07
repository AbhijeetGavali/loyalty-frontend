"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AppProvider } from "@/lib/appContext";
import { ToastProvider } from "@/components/ui/toast";
import { GoogleAnalytics } from "@/lib/GoogleAnalytics";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
      },
    },
  }));

  return (
    <Provider store={store}>
      <GoogleAnalytics />
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>{children}</ToastProvider>
        </QueryClientProvider>
      </AppProvider>
    </Provider>
  );
}
