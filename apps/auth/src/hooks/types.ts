import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

export type MutationHook<
  TResponse,
  TPayload,
  TParams = TPayload,
  TError = Error,
  TContext = unknown,
> = (
  fetcher: (params: TParams) => Promise<TResponse>,
  options?: Omit<
    UseMutationOptions<TResponse, TError, TPayload, TContext>,
    "mutationFn"
  >,
) => UseMutationResult<TResponse, TError, TPayload, TContext>;
