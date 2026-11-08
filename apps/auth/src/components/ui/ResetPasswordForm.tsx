import { type FormEvent, useState } from "react";
import { Alert, Button, Field, Input, Stack } from "@workspace/ui";
import { getSearchParams } from "../../utils";

interface ResetPasswordFormProps {
  onResetPassword: (email: string) => void;
  onUpdatePassword: (password: string, newPassword: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onChange?: () => void;
}

export function ResetPasswordForm({
  onResetPassword,
  onUpdatePassword,
  isLoading,
  error,
  onChange,
}: ResetPasswordFormProps) {
  const { resetPasswordToken } = getSearchParams();

  const [email, setEmail] = useState("andriyshabat@gmail.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = (event: FormEvent) => {
    event.preventDefault();
    onResetPassword(email);
  };

  const handleUpdatePassword = (event: FormEvent) => {
    event.preventDefault();
    onUpdatePassword(password, newPassword);
  };

  if (resetPasswordToken) {
    return (
      <Stack gap="16">
        {error && (
          <Alert tone="error" size="small" role="alert">
            {error}
          </Alert>
        )}
        <Stack as="form" gap="24" onSubmit={handleUpdatePassword} align="start">
          <Field label="Password" required disabled={isLoading}>
            {(control) => (
              <Input
                {...control}
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  onChange?.();
                }}
                placeholder="Enter password"
              />
            )}
          </Field>

          <Field label="New Password" required disabled={isLoading}>
            {(control) => (
              <Input
                {...control}
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  onChange?.();
                }}
                placeholder="Enter new password again"
              />
            )}
          </Field>

          <Button type="submit" size="medium" loading={isLoading}>
            Update Password
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap="16">
      {error && (
        <Alert tone="error" size="small" role="alert">
          {error}
        </Alert>
      )}
      <Stack as="form" gap="24" onSubmit={handleResetPassword} align="start">
        <Field label="Email" required disabled={isLoading}>
          {(control) => (
            <Input
              {...control}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                onChange?.();
              }}
              placeholder="Enter your email"
            />
          )}
        </Field>

        <Button type="submit" size="medium" loading={isLoading}>
          Reset Password
        </Button>
      </Stack>
    </Stack>
  );
}
