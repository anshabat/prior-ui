import { useQuery } from "@tanstack/react-query";
import type { Provider } from "@workspace/api-auth";
import { useMemo } from "react";

const keys = {
  providers: () => ["providers"],
};
export const useOauthProvidersQuery = (fetcher: () => Promise<Provider[]>) => {
  const { data } = useQuery({
    queryKey: keys.providers(),
    queryFn: fetcher,
  });

  const oauthProviders = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => p.id !== "credentials");
  }, [data]);

  return { oauthProviders };
};
