import { ResetPasswordForm } from "../../components/ResetPasswordForm";
import {
  useResetPassword,
  useUpdatePassword,
} from "../../hooks/useResetPassword";
import * as api from "./api";

export function NextAuthResetPassword() {
  const searchParams = new URLSearchParams(window.location.search);
  const resetPasswordToken = searchParams.get("resetPasswordToken");

  const {
    mutate: resetPassword,
    isPending: isResetPasswordLoading,
    error: resetPasswordError,
    reset: resetResetPassword,
  } = useResetPassword(({email, callbackUrl}) => {
    return api.resetPassword({email, callbackUrl})
  });

  const {
    mutate: updatePassword,
    isPending: isUpdatePasswordLoading,
    error: updatePasswordError,
    reset: resetUpdatePassword,
  } = useUpdatePassword(api.updatePassword);

  const handleUpdatePassword = (password: string, newPassword: string) => {
    if (!resetPasswordToken) return;
    updatePassword({
      token: resetPasswordToken,
      password,
      confirmPassword: newPassword,
    });
  };

  const clearErrors = () => {
    resetResetPassword();
    resetUpdatePassword();
  };

  const isLoading = isResetPasswordLoading || isUpdatePasswordLoading;
  const error = resetPasswordError?.message || updatePasswordError?.message;

  return (
    <ResetPasswordForm
      resetPasswordToken={resetPasswordToken}
      onResetPassword={resetPassword}
      onUpdatePassword={handleUpdatePassword}
      isLoading={isLoading}
      error={error}
      onChange={clearErrors}
    />
  );
}
