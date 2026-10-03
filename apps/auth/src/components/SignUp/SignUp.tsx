import { RegisterForm } from "../ui/RegisterForm.tsx";
import { useRegister } from "../../hooks/useRegister.ts";

export function SignUp() {
  const { mutate: registerMutation, isPending, error } = useRegister();

  const handleRegister = async (email: string, password: string) => {
    registerMutation({ email, password });
  };

  return (
    <RegisterForm
      onSubmit={handleRegister}
      isLoading={isPending}
      error={error?.message}
    />
  );
}
