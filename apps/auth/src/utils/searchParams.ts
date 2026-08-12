import { SEARCH_PARAMS } from "../constants/searchParams";

export interface AppSearchParams {
  [SEARCH_PARAMS.RESET_PASSWORD_TOKEN]: string | null;
}

export const getSearchParams = (): AppSearchParams => {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    [SEARCH_PARAMS.RESET_PASSWORD_TOKEN]: searchParams.get(
      SEARCH_PARAMS.RESET_PASSWORD_TOKEN,
    ),
  };
};

/**
 
// utils/queryParams.ts
import { z } from 'zod';

// 1. Define the shape and rules of your URL state
export const queryParamsSchema = z.object({
  resetPasswordToken: z.string().optional(),
  // Coerce will automatically turn the string "2" into the number 2
  page: z.coerce.number().min(1).default(1), 
  sortBy: z.enum(['date', 'name', 'relevance']).default('date'),
});

// 2. Infer the TypeScript type automatically from the schema
export type AppQueryParams = z.infer<typeof queryParamsSchema>;

// 3. Create a single robust parser
export const getParsedQueryParams = (): AppQueryParams => {
  const searchParams = new URLSearchParams(window.location.search);
  
  // Convert URLSearchParams into a standard JavaScript object
  const paramsObject = Object.fromEntries(searchParams.entries());
  
  // Parse the object using Zod. It will apply defaults and type coercion.
  return queryParamsSchema.parse(paramsObject);
};

 */