import { useMutation } from "@tanstack/react-query";
import type { RegisterResponse, RegisterPayload } from "@workspace/api-auth";
import { register } from "../api";
import type { MutationHook } from "./types";

export const useRegister: MutationHook<RegisterResponse, RegisterPayload> = (
  options = {},
) => {
  return useMutation({
    ...options,
    mutationFn: register,
  });
};
