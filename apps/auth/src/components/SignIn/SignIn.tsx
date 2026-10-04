import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithOAuth } from "../../api";
import { SEARCH_PARAMS } from "../../constants";
import { SignInForm } from "../ui/SignInForm.tsx";
import { useLoginMutation, useSignOutMutation } from "../../hooks/useAuthApi.ts";
import { getErrorMessage, getSearchParams, removeSearchParam } from "../../utils";

interface SignInProps {
  refreshSession: () => Promise<unknown>;
}

export function SignIn({ refreshSession }: SignInProps) {
  const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const { error: errorSearchParam } = getSearchParams();

    if (!errorSearchParam) {
      return null;
    }

    return getErrorMessage(errorSearchParam, errorSearchParam);
  });

  const clearError = () => {
    setError(null);
    navigate(removeSearchParam(SEARCH_PARAMS.ERROR), { replace: true });
  }

  const navigate = useNavigate()

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
      clearError();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSignIn = async (email: string, password: string) => {
    clearError();
    signWithCredentials({ email, password });
  };

  const handleVerifyTwoFactor = async (
    email: string,
    password: string,
    code: string,
  ) => {
    clearError();
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
        clearError();
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
