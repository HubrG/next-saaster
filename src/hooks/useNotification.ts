import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useNotifications = (userId: string, email: string, active: boolean) => {
  
  const { data, error } = useSWR(
    userId ? `/api/notifications?userId=${userId}&email=${email}` : null,
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
