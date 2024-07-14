"use client";
import { useQuery } from "@tanstack/react-query";
import { getPlans } from "../helpers/db/plans.action";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";
import { handleError } from "../lib/error-handling/handleError";
import { iPlan } from "../types/db/iPlans";

const fetchSaasPlan = async () => {
  const response = await getPlans({ secret: chosenSecret() });
  if (handleError(response).error) {
    console.error(response.serverError || "Failed to fetch user");
    return null;
  }
  if (!response.data?.success) {
    throw new Error(response.serverError || "Failed to fetch user");
  }

  return response.data.success as iPlan[];
};

export const useSaasPlanQuery = () => {
  return useQuery({
    queryKey: ["saasPlan"],
    staleTime: 1000 * 60 * 60,
    queryFn: () => fetchSaasPlan(),
  });
};
