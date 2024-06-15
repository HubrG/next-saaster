"use client";
import { useQuery } from "@tanstack/react-query";
import { getUser, getUsers } from "../helpers/db/users.action";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";
import { handleError } from "../lib/error-handling/handleError";

const fetchUser = async (email: string) => {
  if (!email) return null;

  const response = await getUser({ email, secret: chosenSecret() });
  if (handleError(response).error) {
    console.error(response.serverError || "Failed to fetch user");
    return null;
  }
  return response?.data?.success;
};

const fetchUsers = async () => {
  const response = await getUsers({ secret: chosenSecret() });
  if (!response.data?.success) {
    throw new Error(response.serverError || "Failed to fetch users");
  }
  return response.data.success;
};

export const useUserQuery = (email: string) => {
  return useQuery({
    queryKey: ["user", email],
    staleTime: 1000 * 60 * 60, // 1 heure
    queryFn: () => fetchUser(email),
  });
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
