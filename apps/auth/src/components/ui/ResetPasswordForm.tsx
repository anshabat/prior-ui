import { type FormEvent, useState } from "react";
import { Button, Field, Input } from "@workspace/ui";
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
      <div>
        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>Error: {error}</div>
        )}
        <form
          onSubmit={handleUpdatePassword}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
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

          <div style={{ display: "flex", gap: 8 }}>
            <Button type="submit" size="medium" loading={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>Error: {error}</div>
      )}
      <form
        onSubmit={handleResetPassword}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
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

        <div style={{ display: "flex", gap: 8 }}>
          <Button type="submit" size="medium" loading={isLoading}>
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}
