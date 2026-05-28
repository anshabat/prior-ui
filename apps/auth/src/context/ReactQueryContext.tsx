import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/react-query").QueryClient;
  }
}
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const ReactQueryContext = createContext<QueryClient | null>(null);

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryContext.Provider value={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ReactQueryContext.Provider>
  );
}

export function useReactQuery() {
  const context = useContext(ReactQueryContext);
  if (!context) {
    throw new Error("useReactQuery must be used within a ReactQueryProvider");
  }
  return context;
}
