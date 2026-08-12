import { ResetPasswordForm } from "../../components/ResetPasswordForm";
import {
  useResetPassword,
  useUpdatePassword,
} from "../../hooks/useResetPassword";
import { getSearchParams } from "../../utils";
import * as api from "./api";

export function NextAuthResetPassword() {
  
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
    const { resetPasswordToken } = getSearchParams();
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
      onResetPassword={resetPassword}
      onUpdatePassword={handleUpdatePassword}
      isLoading={isLoading}
      error={error}
      onChange={clearErrors}
    />
  );
}
