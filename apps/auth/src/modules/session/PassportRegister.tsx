import { RegisterForm } from "../../components/RegisterForm";
import { useRegister } from "../../hooks/useRegister";

export function PassportRegister() {
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
