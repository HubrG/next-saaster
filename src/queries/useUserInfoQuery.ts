"use client";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../helpers/db/users.action";
import { ReturnUserDependencyProps, getUserInfos } from "../helpers/dependencies/user-info";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";
import { handleError } from "../lib/error-handling/handleError";

const fetchUser = async (email: string) => {
  if (!email) return null;

  const response = await getUser({ email, secret: chosenSecret() });
  if (handleError(response).error) {
    console.error(response.serverError || "Failed to fetch user");
    return null;
  }
  if (!response.data?.success) {
    throw new Error(response.serverError || "Failed to fetch user");
  }
  const userInfos = getUserInfos({ user: response.data.success });
  return userInfos as ReturnUserDependencyProps;
};



export const useUserInfoQuery = (email: string) => {
  return useQuery({
    queryKey: ["userInfo", email],
    staleTime: 1000 * 60 * 60,
    queryFn: () => fetchUser(email),
  });
};