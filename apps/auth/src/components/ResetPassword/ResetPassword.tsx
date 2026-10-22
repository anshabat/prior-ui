import { ResetPasswordForm } from "../ui/ResetPasswordForm.tsx";
import {
  useResetPassword,
  useUpdatePassword,
} from "../../hooks/useResetPassword.ts";
import { getSearchParams } from "../../utils";

export function ResetPassword() {
  const {
    mutate: handleResetPassword,
    isPending: isResetPasswordPending,
    error: resetPasswordError,
  } = useResetPassword();

  const {
    mutate: updatePasswordMutation,
    error: updatePasswordError,
    isPending: isUpdatePasswordPending,
  } = useUpdatePassword();

  const handleUpdatePassword = (password: string, newPassword: string) => {
    const { resetPasswordToken } = getSearchParams();
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
      onResetPassword={handleResetPassword}
      onUpdatePassword={handleUpdatePassword}
      isLoading={isLoading}
      error={error}
    />
  );
}
