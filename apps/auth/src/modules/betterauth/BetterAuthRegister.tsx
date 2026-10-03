import { register } from "./api";
import { RegisterForm } from "../../components/RegisterForm";
import { useRegister } from "../../hooks/useRegister";

export function BetterAuthRegister() {
  const { mutate: registerMutation, isPending, error } = useRegister(register);

  return (
    <RegisterForm
      onSubmit={(email, password) => registerMutation({ email, password })}
      isLoading={isPending}
      error={error?.message}
    />
  );
}
