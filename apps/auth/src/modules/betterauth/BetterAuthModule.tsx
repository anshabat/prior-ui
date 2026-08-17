import { useState } from "react";
import { pingOk } from "./api";

export function BetterAuthModule() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePing = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = await pingOk();
      setResult(JSON.stringify(body, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Better Auth smoke</h2>
      <button type="button" onClick={handlePing} disabled={isLoading}>
        {isLoading ? "Calling /api/auth/ok…" : "Smoke ok"}
      </button>
      {result && <pre>{result}</pre>}
      {error && <p>{error}</p>}
    </div>
  );
}
