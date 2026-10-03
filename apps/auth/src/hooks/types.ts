import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

export type MutationHook<
  TResponse,
  TPayload,
  TError = Error,
  TContext = unknown,
> = (
  options?: Omit<
    UseMutationOptions<TResponse, TError, TPayload, TContext>,
    "mutationFn"
  >,
) => UseMutationResult<TResponse, TError, TPayload, TContext>;
