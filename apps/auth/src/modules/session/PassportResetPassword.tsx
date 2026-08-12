import { resetPassword, updatePassword } from "./api";
import { ResetPasswordForm } from "../../components/ResetPasswordForm";
import {
  useResetPassword,
  useUpdatePassword,
} from "../../hooks/useResetPassword";
import { getSearchParams } from "../../utils";

export function PassportResetPassword() {

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
