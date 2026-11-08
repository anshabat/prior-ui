import { Link as RouterLink } from "react-router-dom";
import { Link, Stack, Text } from "@workspace/ui";
import { SignIn } from "../components/SignIn/SignIn.tsx";
import { Page } from "../components/ui/Page.tsx";
import { ROUTES } from "../constants";

export function SignInPage() {
  return (
    <Page
      title="Welcome"
      subtitle="Log in to your account"
      documentTitle="Log in"
    >
      <Stack gap="24">
        <SignIn />
        <Text size="tiny" tone="weak">
          Don’t have an account?{" "}
          <Link asChild size="tiny">
            <RouterLink to={ROUTES.SIGN_UP}>Sign up</RouterLink>
          </Link>
        </Text>
      </Stack>
    </Page>
  );
}
