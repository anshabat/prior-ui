import { useMutation } from "@tanstack/react-query";
import type {
  ResetPasswordResponse,
  UpdatePasswordResponse,
} from "@workspace/api-auth";
import { resetPassword, updatePassword } from "../api";
import { ERROR_MESSAGES } from "../constants";
import type { MutationHook } from "./types";

export const useResetPassword: MutationHook<ResetPasswordResponse, string> = (
  options = {},
) => {
  return useMutation({
    ...options,
    mutationFn: (email) => {
      const callbackUrl = `${window.location.origin}${window.location.pathname}`;
      return resetPassword({ email, callbackUrl });
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
  UpdatePasswordParams
> = (options = {}) => {
  return useMutation({
    ...options,
    mutationFn: ({ token, password, confirmPassword }) => {
      if (!token) {
        return Promise.reject(new Error(ERROR_MESSAGES.UpdatePasswordMissingToken));
      }
      if (password !== confirmPassword) {
        return Promise.reject(new Error(ERROR_MESSAGES.UpdataPasswordMatch));
      }
      return updatePassword({ token, password });
    },
  });
};
