import type {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

export type MutationHook<
  TData,
  TPayload,
  TError = Error,
  TContext = unknown,
> = (
  fetcher: MutationFunction<TData, TPayload>,
  options?: Omit<
    UseMutationOptions<TData, TError, TPayload, TContext>,
    "mutationFn"
  >,
) => UseMutationResult<TData, TError, TPayload, TContext>;
