import type { ReactNode } from "react";
import NextLink from "next/link";
import { useAuthHandlers } from "@workspace/apps-lib/auth/react";
import { Link, Logo, Stack } from "@workspace/ui";
import { useSession } from "../hooks/useSession";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { status } = useSession();

  return (
    <>
      <header className="flex items-center justify-between border-b border-weak px-24 py-16">
        <Link asChild underline={false}>
          <NextLink href="/">
            <Logo />
          </NextLink>
        </Link>
        {/* Nothing while loading: the slot is last in the row, so it appears without shifting the layout */}
        {status !== "loading" && (
          <AuthLinks authenticated={status === "authenticated"} />
        )}
      </header>
      <main>{children}</main>
    </>
  );
}

type AuthLinksProps = {
  authenticated: boolean;
};

// Rendered only after the session request settles, which happens in the browser, so `window` exists
function AuthLinks({ authenticated }: AuthLinksProps) {
  const redirectUrl = encodeURIComponent(window.location.href);
  const { loginHref, logoutHref, accountHref } = useAuthHandlers(redirectUrl);

  if (!authenticated) {
    return <Link href={loginHref}>Login</Link>;
  }

  return (
    <Stack direction="row" gap="16">
      <Link asChild>
        <NextLink href="/profile">Profile</NextLink>
      </Link>
      <Link href={accountHref}>Account Settings</Link>
      <Link href={logoutHref}>Logout</Link>
    </Stack>
  );
}
