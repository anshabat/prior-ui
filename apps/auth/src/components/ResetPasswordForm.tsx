import { type FormEvent, useState } from "react";
import { getSearchParams } from "../utils";

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
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                onChange?.();
              }}
              placeholder="Enter password"
              disabled={isLoading}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                onChange?.();
              }}
              placeholder="Enter new password again"
              disabled={isLoading}
            />
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </button>
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
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              onChange?.();
            }}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
