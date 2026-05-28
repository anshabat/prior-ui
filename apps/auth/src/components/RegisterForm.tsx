import { type FormEvent, useState } from "react";

interface RegisterFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error: string | null;
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
    <div>
      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>Error: {error}</div>
      )}
      <form
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Email
          <input
            type="email"
            value={registerEmail}
            onChange={(event) => setRegisterEmail(event.target.value)}
            disabled={isLoading}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Password
          <input
            type="password"
            value={registerPassword}
            onChange={(event) => setRegisterPassword(event.target.value)}
            disabled={isLoading}
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
}
