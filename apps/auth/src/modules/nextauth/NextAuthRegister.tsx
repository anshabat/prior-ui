import { RegisterForm } from "../../components/RegisterForm";
import { useRegister } from "../../hooks/useRegister";
import * as api from "./api";

export function NextAuthRegister() {
  const {
    mutate: handleRegister,
    isPending,
    errorMessage,
  } = useRegister(api.register);

  return (
    <RegisterForm
      onSubmit={(email, password) => handleRegister({ email, password })}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}
