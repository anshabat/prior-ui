export interface AuthConfig {
  AUTH_STRATEGY: "passport" | "nextauth";
  API_BASE_URL: string;
  API_PORT: number;
  APP_PORT: number;
  APP_BASE_URL: string;
  CLIENT_APPS_URLS: string[];
}


export const authConfig: AuthConfig = {
  AUTH_STRATEGY: "passport",
  API_PORT: 4001,
  APP_PORT: 3001,
  API_BASE_URL: "http://localhost:4001",
  APP_BASE_URL: "http://localhost:3001",
  CLIENT_APPS_URLS: ["http://localhost:5173", "http://localhost:3000"],
};