import {
  useMutation,
  type MutationFunction,
  type UseMutationResult,
} from "@tanstack/react-query";

type UseRegisterPayload = {
  email: string;
  password: string;
};
type UseRegisterOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

type UseRegisterReturn = UseMutationResult<
  void,
  Error,
  UseRegisterPayload,
  unknown
> & {
  errorMessage: string | null;
};

export function useRegister(
  fetcher: MutationFunction<void, UseRegisterPayload>,
  { onSuccess, onError }: UseRegisterOptions = {},
): UseRegisterReturn {
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
