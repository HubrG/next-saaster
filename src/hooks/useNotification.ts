import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useNotifications = (
  userId: string,
  email: string,
  active: boolean
) => {
  // Vérifiez que userId, email et active sont valides avant d'appeler useSWR
  const shouldFetch = userId && email && active;

  const { data, error } = useSWR(
    shouldFetch ? `/api/notifications?userId=${userId}&email=${email}` : null,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  return {
    notifications: data,
    isLoading: !error && !data,
    isError: error,
  };
};
