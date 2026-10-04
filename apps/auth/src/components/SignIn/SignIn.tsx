import { useState } from "react";
import { signInWithOAuth } from "../../api";
import { SignInForm } from "../ui/SignInForm.tsx";
import { useLoginMutation, useSignOutMutation } from "../../hooks/useAuthApi.ts";
import { getErrorMessage, getSearchParams } from "../../utils";

interface SignInProps {
  refreshSession: () => Promise<unknown>;
}

export function SignIn({ refreshSession }: SignInProps) {
  const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const { error: searchParamsError } = getSearchParams();

    if (!searchParamsError) {
      return null;
    }

    return getErrorMessage(searchParamsError, searchParamsError);
  });

  const { mutate: signWithCredentials } = useLoginMutation({
    onSuccess: (data) => {
      setIsTwoFactorStep(data.twoFactor);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const { mutate: signOut } = useSignOutMutation({
    onSuccess: () => {
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

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
      onSignOut={signOut}
      providers={[
        { id: "google", name: "Google" },
        { id: "github", name: "GitHub" },
      ]}
      onOAuthSignIn={handleOAuthSignIn}
    />
  );
}
