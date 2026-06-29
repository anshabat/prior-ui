export type SuccessResult<T> = readonly [T, null];
export type ErrorResult<E> = readonly [null, E];

export type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export async function tryCatchAsync<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}

export function tryCatchSync<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    const data = fn();
    return [data, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
