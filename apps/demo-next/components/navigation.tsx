"use client";

import Link from "next/link";
import { useHref } from "../hooks/useHref";
import { AuthSession } from "@workspace/api-auth";
import { useAuthHandlers } from "@workspace/apps-lib/auth/react";

type NavigationProps = {
  user: AuthSession["user"] | null;
};

export default function Navigation({ user }: NavigationProps) {
  const redirectUrl = encodeURIComponent(useHref());
  const { loginHref, logoutHref, openLoginPopup, openLogoutPopup } =
    useAuthHandlers(redirectUrl);

  return (
    <nav className="flex gap-4">
      <Link href="/" className="text-blue-600 underline">
        Home
      </Link>
      <Link href="/chat" className="text-blue-600 underline">
        Chat
      </Link>
      {user?.email ? (
        <>
          <button onClick={openLogoutPopup} className="underline">
            Logout popup
          </button>
          <Link href={logoutHref} className="text-blue-600 underline">
            Logout
          </Link>
        </>
      ) : (
        <>
          <button onClick={openLoginPopup} className="underline">
            Login popup
          </button>
          <Link href={loginHref} className="text-blue-600 underline">
            Login
          </Link>
        </>
      )}
    </nav>
  );
}
