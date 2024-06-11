"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth"; // Importez le type Session

import { SessionProvider } from "next-auth/react";
type ProviderProps = {
  children: React.ReactNode;
  session: Session;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});
export default function SessProvider({ children, session }: ProviderProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
