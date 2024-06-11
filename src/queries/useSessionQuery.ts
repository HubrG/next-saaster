"use client";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

const fetchSession = async () => {
  const session = await getSession() as Session | undefined;
  return session;
};

export const useSessionQuery = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 60, 
  });
};
