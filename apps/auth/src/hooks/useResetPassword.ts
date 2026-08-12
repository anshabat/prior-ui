import { useMutation } from "@tanstack/react-query";
import type {
  ResetPasswordPayload,
  ResetPasswordResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
} from "@workspace/api-auth";
import type { MutationHook } from "./types";
import { ERROR_MESSAGES } from "../utils/errors";

export const useResetPassword: MutationHook<
  ResetPasswordResponse,
  string,
  ResetPasswordPayload
> = (fetcher, options = {}) => {
  return useMutation({
    ...options,
    mutationFn: (email) => {
      const callbackUrl = `${window.location.origin}${window.location.pathname}`;
      return fetcher({ email, callbackUrl });
    },
  });
};

type UpdatePasswordParams = {
  token: string | null;
  password: string;
  confirmPassword: string;
};

export const useUpdatePassword: MutationHook<
  UpdatePasswordResponse,
  UpdatePasswordParams,
  UpdatePasswordPayload
> = (fetcher, options = {}) => {
  return useMutation({
    ...options,
    mutationFn: ({ token, password, confirmPassword }) => {
      if (!token) {
        return Promise.reject(new Error(ERROR_MESSAGES.UpdatePasswordMissingToken));
      }
      if (password !== confirmPassword) {
        return Promise.reject(new Error(ERROR_MESSAGES.UpdataPasswordMatch));
      }
      return fetcher({ token, password });
    },
  });
};
