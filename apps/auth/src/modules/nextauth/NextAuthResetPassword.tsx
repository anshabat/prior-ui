import { ResetPasswordForm } from "../../components/ResetPasswordForm";
import {
  useResetPassword,
  useUpdatePassword,
} from "../../hooks/useResetPassword";
import * as api from "./api";
import { ERROR_MESSAGES } from "../../utils/errors";

export function NextAuthResetPassword() {
  const searchParams = new URLSearchParams(window.location.search);
  const resetPasswordToken = searchParams.get("resetPasswordToken");

  const {
    mutate: resetPassword,
    isPending: isResetPasswordLoading,
    errorMessage: resetPasswordError,
    reset: resetResetPassword,
  } = useResetPassword(api.resetPassword);

  const {
    mutate: updatePassword,
    isPending: isUpdatePasswordLoading,
    errorMessage: updatePasswordError,
    reset: resetUpdatePassword,
  } = useUpdatePassword(({ token, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      return Promise.reject(new Error(ERROR_MESSAGES.UpdataPasswordMatch));
    }
    return api.updatePassword({ token, password });
  });

  const handleResetPassword = (email: string) => {
    const callbackUrl = `${window.location.origin}${window.location.pathname}`;
    resetPassword({ email, callbackUrl });
  };

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
  const error = resetPasswordError || updatePasswordError;

  return (
    <ResetPasswordForm
      resetPasswordToken={resetPasswordToken}
      onResetPassword={handleResetPassword}
      onUpdatePassword={handleUpdatePassword}
      isLoading={isLoading}
      error={error}
      onChange={clearErrors}
    />
  );
}
