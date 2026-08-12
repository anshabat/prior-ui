import { resetPassword, updatePassword } from "./api";
import { ResetPasswordForm } from "../../components/ResetPasswordForm";
import {
  useResetPassword,
  useUpdatePassword,
} from "../../hooks/useResetPassword";

export function PassportResetPassword() {
  const searchParams = new URLSearchParams(window.location.search);
  const resetPasswordToken = searchParams.get("resetPasswordToken");

  const {
    mutate: handleResetPassword,
    isPending: isResetPasswordPending,
    error: resetPasswordError,
  } = useResetPassword(resetPassword);

  const {
    mutate: updatePasswordMutation,
    error: updatePasswordError,
    isPending: isUpdatePasswordPending,
  } = useUpdatePassword(updatePassword);

  const handleUpdatePassword = (password: string, newPassword: string) => {
    if (!resetPasswordToken) return;
    updatePasswordMutation({
      token: resetPasswordToken,
      password,
      confirmPassword: newPassword,
    });
  };

  const isLoading = isResetPasswordPending || isUpdatePasswordPending;
  const error = resetPasswordError?.message || updatePasswordError?.message;

  return (
    <ResetPasswordForm
      resetPasswordToken={resetPasswordToken}
      onResetPassword={handleResetPassword}
      onUpdatePassword={handleUpdatePassword}
      isLoading={isLoading}
      error={error}
    />
  );
}
