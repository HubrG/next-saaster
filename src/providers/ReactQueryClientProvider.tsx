"use client";

import { QueryClientProvider, hydrate } from "@tanstack/react-query";
import { queryClient } from "@/src/lib/queryClient";

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
