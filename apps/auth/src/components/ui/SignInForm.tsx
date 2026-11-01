import { type FormEvent, useState } from "react";
import { Button, Field, Input } from "@workspace/ui";

export interface SignInFormProps {
  title?: string;
  error: string | null;
  isTwoFactorStep: boolean;
  onSignIn: (email: string, password: string) => void;
  onVerifyTwoFactor: (email: string, password: string, code: string) => void;
  onCancelTwoFactor: () => void;
  onGetSession: () => void;
  onSignOut: () => void;
  providers: {id: string, name: string}[];
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
            <Field label="Email" required>
              {(control) => (
                <Input
                  {...control}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              )}
            </Field>

            <Field label="Password" required>
              {(control) => (
                <Input
                  {...control}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              )}
            </Field>
          </>
        )}

        {isTwoFactorStep && (
          <Field label="OTP Code" required>
            {(control) => (
              <Input
                {...control}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                autoFocus
              />
            )}
          </Field>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button type="submit">
            {isTwoFactorStep ? "Verify code" : "Sign in"}
          </Button>
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
