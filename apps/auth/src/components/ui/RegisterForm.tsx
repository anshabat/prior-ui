import { type FormEvent, useState } from "react";
import { Alert, Button, Field, Input, Stack } from "@workspace/ui";

interface RegisterFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  const [registerEmail, setRegisterEmail] = useState("andriyshabat@gmail.com");
  const [registerPassword, setRegisterPassword] = useState("123");

  const handleRegister = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(registerEmail, registerPassword);
  };

  return (
    <Stack gap="16">
      {error && (
        <Alert tone="error" size="small" role="alert">
          {error}
        </Alert>
      )}
      <Stack as="form" gap="24" onSubmit={handleRegister} align="start">
        <Field label="Email" required disabled={isLoading}>
          {(control) => (
            <Input
              {...control}
              type="email"
              autoComplete="email"
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
            />
          )}
        </Field>

        <Field label="Password" required disabled={isLoading}>
          {(control) => (
            <Input
              {...control}
              type="password"
              autoComplete="new-password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
            />
          )}
        </Field>

        <Button type="submit" size="medium" loading={isLoading}>
          Create account
        </Button>
      </Stack>
    </Stack>
  );
}
