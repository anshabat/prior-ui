import { useState } from "react";
import { resetPassword, updatePassword } from "./api";
import { ResetPasswordForm } from "../../components/ResetPasswordForm";

export function PassportResetPassword() {
  const searchParams = new URLSearchParams(window.location.search);
  const resetPasswordToken = searchParams.get("resetPasswordToken");

  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (resetEmail: string) => {
    setIsLoading(true);
    try {
      const callbackUrl = `${window.location.origin}${window.location.pathname}`;
      const data = await resetPassword(resetEmail, callbackUrl);
      console.log("Reset password result", data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (
    password: string,
    newPassword: string,
  ) => {
    if (password !== newPassword) {
      console.error("Passwords do not match");
      return;
    }

    if (!resetPasswordToken) {
      console.error("Missing reset password token");
      return;
    }

    setIsLoading(true);
    try {
      const data = await updatePassword(resetPasswordToken, password);
      console.log("Update password result", data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResetPasswordForm
      resetPasswordToken={resetPasswordToken}
      onResetPassword={handleResetPassword}
      onUpdatePassword={handleUpdatePassword}
      isLoading={isLoading}
      error={null}
    />
  );
}
