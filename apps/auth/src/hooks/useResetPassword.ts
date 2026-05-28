import {
  useMutation,
  type MutationFunction,
  type UseMutationResult,
} from "@tanstack/react-query";

type UseResetPasswordPayload = {
  email: string;
  callbackUrl: string;
};
type UseResetPasswordOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

type UseResetPasswordReturn = UseMutationResult<
  void,
  Error,
  UseResetPasswordPayload,
  unknown
> & {
  errorMessage: string | null;
};

export function useResetPassword(
  fetcher: MutationFunction<void, UseResetPasswordPayload>,
  { onSuccess, onError }: UseResetPasswordOptions = {},
): UseResetPasswordReturn {
  const mutationResult = useMutation({
    mutationFn: fetcher,
    onSuccess,
    onError,
  });

  return {
    ...mutationResult,
    errorMessage: mutationResult.error ? mutationResult.error.message : null,
  };
}

type UseUpdatePasswordPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};
type UseUpdatePasswordOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

type UseUpdatePasswordReturn = UseMutationResult<
  void,
  Error,
  UseUpdatePasswordPayload,
  unknown
> & {
  errorMessage: string | null;
};

export function useUpdatePassword(
  fetcher: MutationFunction<void, UseUpdatePasswordPayload>,
  { onSuccess, onError }: UseUpdatePasswordOptions = {},
): UseUpdatePasswordReturn {
  const mutationResult = useMutation({
    mutationFn: fetcher,
    onSuccess,
    onError,
  });

  return {
    ...mutationResult,
    errorMessage: mutationResult.error ? mutationResult.error.message : null,
  };
}
