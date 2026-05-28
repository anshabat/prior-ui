import type { ReactNode } from "react";

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
  return (
    <div>
      {SignInForm}

      <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
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
