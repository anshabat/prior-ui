export interface MarketConfig {
  API_BASE_URL: string;
  APP_BASE_URL: string;
}

// market-api is legacy and outside the workspace, so it can't import this:
// its port (4002) is duplicated in apps/market/api/src/main.ts
export const marketConfig: MarketConfig = {
  API_BASE_URL: "http://localhost:4002",
  APP_BASE_URL: "http://localhost:3100",
};
