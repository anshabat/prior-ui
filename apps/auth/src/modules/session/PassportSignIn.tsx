import { useState } from "react";
import { signIn, logout, signInWithOAuth } from "./api";
import { SignInForm } from "../../components/SignInForm";

interface PassportSignInProps {
  refreshSession: () => Promise<unknown>;
}

export function PassportSignIn({ refreshSession }: PassportSignInProps) {
  const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    setError(null);

    const result = await signIn({ email, password });

    if (result.twoFactor) {
      setIsTwoFactorStep(true);
      return;
    }

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.session) {
      setIsTwoFactorStep(false);
      await refreshSession();
    }
  };

  const handleVerifyTwoFactor = async (
    email: string,
    password: string,
    code: string,
  ) => {
    setError(null);

    const result = await signIn({ email, password, code });
    console.log("Verify 2FA result", result);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.session) {
      setIsTwoFactorStep(false);
      await refreshSession();
    }
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
