import { type FormEvent, useState } from "react";
import type { Provider } from "@workspace/api-auth";

export interface SignInFormProps {
  title?: string;
  error: string | null;
  isTwoFactorStep: boolean;
  onSignIn: (email: string, password: string) => void;
  onVerifyTwoFactor: (email: string, password: string, code: string) => void;
  onCancelTwoFactor: () => void;
  onGetSession: () => void;
  onSignOut: () => void;
  providers: Pick<Provider, "id" | "name">[];
  onOAuthSignIn: (providerId: string) => void;
}

export function SignInForm({
  title = "Sign In",
  error,
  isTwoFactorStep,
  onSignIn,
  onVerifyTwoFactor,
  onCancelTwoFactor,
  onGetSession,
  onSignOut,
  providers,
  onOAuthSignIn,
}: SignInFormProps) {
  const [email, setEmail] = useState("andriyshabat@gmail.com");
  const [password, setPassword] = useState("123");
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isTwoFactorStep) {
      onVerifyTwoFactor(email, password, otpCode);
    } else {
      setOtpCode(""); // clear any previous left-over OTP
      onSignIn(email, password);
    }
  };

  const handleCancelTwoFactor = () => {
    setOtpCode("");
    onCancelTwoFactor();
  };

  return (
    <div>
      <h2>{title}</h2>
      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>Error: {error}</div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 24,
        }}
      >
        {!isTwoFactorStep && (
          <>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </>
        )}

        {isTwoFactorStep && (
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            OTP Code
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value)}
              autoFocus
            />
          </label>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="submit">
            {isTwoFactorStep ? "Verify code" : "Sign in"}
          </button>
          {isTwoFactorStep && (
            <button type="button" onClick={handleCancelTwoFactor}>
              Back
            </button>
          )}
          <button type="button" onClick={onGetSession}>
            Get session
          </button>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {!isTwoFactorStep &&
            providers.length > 0 &&
            providers.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => onOAuthSignIn(provider.id)}
              >
                {provider.name}
              </button>
            ))}
        </div>
      </form>
    </div>
  );
}
