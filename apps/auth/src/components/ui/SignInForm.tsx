import { type FormEvent, type ReactNode, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Github, GoogleBrand } from "@workspace/icons";
import {
  Alert,
  Button,
  Divider,
  Field,
  Input,
  Link,
  Stack,
} from "@workspace/ui";
import { ROUTES } from "../../constants";

const providerIcons: Record<string, ReactNode> = {
  google: <GoogleBrand />,
  github: <Github />,
};

export interface SignInFormProps {
  successMessage: string;
  error: string | null;
  isTwoFactorStep: boolean;
  onSignIn: (email: string, password: string) => void;
  onVerifyTwoFactor: (email: string, password: string, code: string) => void;
  onCancelTwoFactor: () => void;
  providers: { id: string; name: string }[];
  onOAuthSignIn: (providerId: string) => void;
}

export function SignInForm({
  successMessage,
  error,
  isTwoFactorStep,
  onSignIn,
  onVerifyTwoFactor,
  onCancelTwoFactor,
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
    <Stack gap="16">
      {/* No role: the success message is rendered with the page, not after an action */}
      {successMessage && (
        <Alert tone="success" size="small">
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert tone="error" size="small" role="alert">
          {error}
        </Alert>
      )}

      {!isTwoFactorStep && providers.length > 0 && (
        <Stack gap="16">
          <Stack gap="8">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                type="button"
                variant="secondary"
                tone="neutral"
                size="medium"
                startIcon={providerIcons[provider.id]}
                onClick={() => onOAuthSignIn(provider.id)}
              >
                Log in with {provider.name}
              </Button>
            ))}
          </Stack>
          <Divider>OR</Divider>
        </Stack>
      )}

      <Stack as="form" gap="24" onSubmit={handleSubmit}>
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

            <Stack gap="8">
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
              <Stack align="start">
                <Link asChild size="tiny">
                  <RouterLink to={ROUTES.RESET_PASSWORD}>
                    Forgot password?
                  </RouterLink>
                </Link>
              </Stack>
            </Stack>
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

        <Stack gap="8">
          <Button type="submit" size="medium">
            {isTwoFactorStep ? "Verify code" : "Log in"}
          </Button>
          {isTwoFactorStep && (
            <Button
              type="button"
              variant="secondary"
              tone="neutral"
              size="medium"
              onClick={handleCancelTwoFactor}
            >
              Back
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
