import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes fresh
          gcTime: 15 * 60 * 1000, // Keep in memory for 15 minutes
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      },
    });
  }

  return queryClient;
}
