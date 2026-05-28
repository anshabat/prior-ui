import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AuthSession,
  SignInResponse,
  SignOutResponse,
} from "@workspace/api-auth";
import type { MutationHook } from "./types";

const keys = {
  getSession: () => ["session"],
};

export function useSessionQuery(getSession: () => Promise<AuthSession | null>) {
  const {
    data: session,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: keys.getSession(),
    queryFn: async () => {
      const data = await getSession();
      return data?.user ? data : null;
    },
  });

  return {
    session: session ?? null,
    isLoading,
    error,
    refreshSession: refetch,
  };
}

function useSessionInvalidate() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: keys.getSession() });
  };
}

type LoginMutationPayload = {
  email: string;
  password: string;
  twoFactorCode?: string;
};
export const useLoginMutation: MutationHook<
  SignInResponse,
  LoginMutationPayload
> = (fetcher, options = {}) => {
  const invalidateSession = useSessionInvalidate();

  const mutation = useMutation({
    ...options,
    mutationFn: fetcher,
    onSuccess: async (...params) => {
      await invalidateSession();
      options.onSuccess?.(...params);
    },
  });

  return mutation;
};

export const useSignOutMutation: MutationHook<SignOutResponse, void> = (
  fetcher,
  options = {},
) => {
  const invalidateSession = useSessionInvalidate();

  const mutation = useMutation({
    ...options,
    mutationFn: fetcher,
    onSuccess: async (...params) => {
      await invalidateSession();
      options.onSuccess?.(...params);
    },
  });

  return mutation;
};
