import { useState } from "react";
import { register } from "./api";
import { RegisterForm } from "../../components/RegisterForm";

export function PassportRegister() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await register({ email, password });
      console.log("Register result", result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm
      onSubmit={handleRegister}
      isLoading={isLoading}
      error={null}
    />
  );
}
