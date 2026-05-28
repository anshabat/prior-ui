const ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:3000"];

function extractTargetOrigin(redirectUrl: string | null): string | null {
  if (!redirectUrl) return null;

  try {
    const targetOrigin = new URL(redirectUrl).origin;
    if (ALLOWED_ORIGINS.includes(targetOrigin)) {
      return targetOrigin;
    }
  } catch {
    return null;
  }

  return null;
}

export function redirectToOpener(redirectUrl: string | null): void {
  if (!redirectUrl) return;

  const targetOrigin = extractTargetOrigin(redirectUrl);
  if (!targetOrigin) return;

  if (window.opener) {
    window.opener.postMessage("auth_success", targetOrigin);
    window.close();
  } else {
    window.location.href = redirectUrl;
  }
}
