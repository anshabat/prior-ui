import type { ReactNode } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { AuthSession } from "@workspace/api-auth";
import { useAuthHandlers } from "@workspace/apps-lib/auth/react";
import { config } from "@workspace/config";
import { Link, Logo, Stack } from "@workspace/ui";

const { APP_BASE_URL } = config.market;

type LayoutProps = {
  session: AuthSession | null;
  children: ReactNode;
};

export function Layout({ session, children }: LayoutProps) {
  const { asPath } = useRouter();
  const redirectUrl = encodeURIComponent(`${APP_BASE_URL}${asPath}`);
  const { loginHref, logoutHref, accountHref } = useAuthHandlers(redirectUrl);

  return (
    <>
      <header className="flex items-center justify-between border-b border-weak px-24 py-16">
        <Link asChild underline={false}>
          <NextLink href="/">
            <Logo />
          </NextLink>
        </Link>
        {session ? (
          <Stack direction="row" gap="16">
            <Link asChild>
              <NextLink href="/profile">Profile</NextLink>
            </Link>
            <Link href={accountHref}>Account Settings</Link>
            <Link href={logoutHref}>Logout</Link>
          </Stack>
        ) : (
          <Link href={loginHref}>Login</Link>
        )}
      </header>
      <main>{children}</main>
    </>
  );
}
