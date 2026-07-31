import { useMutation } from "@tanstack/react-query";
import type { RegisterResponse, RegisterPayload } from "@workspace/api-auth";
import type { MutationHook } from "./types";

export const useRegister: MutationHook<RegisterResponse, RegisterPayload> = (
  fetcher,
  options = {},
) => {
  return useMutation({
    ...options,
    mutationFn: fetcher,
  });
};
