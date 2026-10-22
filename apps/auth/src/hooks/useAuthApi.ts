import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SignInResponse, SignOutResponse } from "@workspace/api-auth";
import { getSession, logout, signIn } from "../api";
import type { MutationHook } from "./types";

const keys = {
  getSession: () => ["session"],
};

export function useSessionQuery() {
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
> = (options = {}) => {
  const invalidateSession = useSessionInvalidate();

  return useMutation({
    ...options,
    mutationFn: ({ email, password, twoFactorCode }) =>
      signIn({ email, password, code: twoFactorCode }),
    onSuccess: async (...params) => {
      await invalidateSession();
      options.onSuccess?.(...params);
    },
  });
};

export const useSignOutMutation: MutationHook<SignOutResponse, void> = (
  options = {},
) => {
  const invalidateSession = useSessionInvalidate();

  return useMutation({
    ...options,
    mutationFn: logout,
    onSuccess: async (...params) => {
      await invalidateSession();
      options.onSuccess?.(...params);
    },
  });
};
