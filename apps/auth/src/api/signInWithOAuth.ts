import { config } from "@workspace/config";

const { API_BASE_URL } = config.auth;

export function signInWithOAuth(provider: string) {
  const callbackUrl = window.location.href;
  const url = callbackUrl
    ? `${API_BASE_URL}/api/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : `${API_BASE_URL}/api/signin/${provider}`;
  window.location.href = url;
}
