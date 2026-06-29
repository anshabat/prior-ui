import { useState } from "react";
import { signIn, logout, signInWithOAuth } from "./api";
import { SignInForm } from "../../components/SignInForm";
import { useLoginMutation } from "../../hooks/useAuthApi";

interface PassportSignInProps {
  refreshSession: () => Promise<unknown>;
}

export function PassportSignIn({ refreshSession }: PassportSignInProps) {
  const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: signWithCredentials } = useLoginMutation(
    async ({ email, password, twoFactorCode }) =>
      signIn({ email, password, code: twoFactorCode }),
    {
      onSuccess: (data) => {
        setIsTwoFactorStep(data.twoFactor);
      },
      onError: (error) => {
        setError(error.message);
      },
    },
  );

  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    signWithCredentials({ email, password });
  };

  const handleVerifyTwoFactor = async (
    email: string,
    password: string,
    code: string,
  ) => {
    setError(null);
    signWithCredentials({ email, password, twoFactorCode: code });
  };

  const handleGetSession = async () => {
    await refreshSession();
  };

  const handleLogout = async () => {
    const result = await logout();
    console.log("Logout result", result);
  };

  const handleOAuthSignIn = (providerId: string) => {
    signInWithOAuth(providerId);
  };

  return (
    <SignInForm
      title="Custom Login"
      error={error}
      isTwoFactorStep={isTwoFactorStep}
      onSignIn={handleSignIn}
      onVerifyTwoFactor={handleVerifyTwoFactor}
      onCancelTwoFactor={() => {
        setIsTwoFactorStep(false);
        setError(null);
      }}
      onGetSession={handleGetSession}
      onSignOut={handleLogout}
      providers={[
        { id: "google", name: "Google" },
        { id: "github", name: "GitHub" },
      ]}
      onOAuthSignIn={handleOAuthSignIn}
    />
  );
}
