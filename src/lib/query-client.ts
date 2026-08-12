import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 60 * 1000, // 30 minutes fresh
          gcTime: 60 * 60 * 1000, // Keep in memory for 1 hour
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          retry: 1,
          networkMode: "offlineFirst",
        },
      },
    });
  }

  return queryClient;
}

