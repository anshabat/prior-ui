import type { ReactNode } from "react";
import { useFlashQueryParam } from "../../hooks/useFlashQueryParam.ts";
import { getSuccessMessage } from "../../utils";

export interface LayoutProps {
  SignInForm: ReactNode;
  RegisterForm: ReactNode;
  ResetPasswordForm: ReactNode;
}

export function Layout({
  SignInForm,
  RegisterForm,
  ResetPasswordForm,
}: LayoutProps) {
  const flashSuccess = useFlashQueryParam("success");
  const successMessage = getSuccessMessage(flashSuccess);

  return (
    <div>
      {successMessage && (
        <div style={{ marginBottom: 30, color: "green" }}>
          {successMessage}
        </div>
      )}
      {SignInForm}

      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 60,
          minWidth: 600,
          width: "100%",
        }}
      >
        <div>
          <h2>Register</h2>
          {RegisterForm}
        </div>

        <div>
          <h2>Reset Password</h2>
          {ResetPasswordForm}
        </div>
      </div>
    </div>
  );
}
