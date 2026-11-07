import { Link as RouterLink } from "react-router-dom";
import { Link, Stack } from "@workspace/ui";
import { SignUp } from "../components/SignUp/SignUp.tsx";
import { Page } from "../components/ui/Page.tsx";
import { ROUTES } from "../constants";

export function SignUpPage() {
  return (
    <Page
      title="Sign up free"
      subtitle="No credit card required"
      documentTitle="Create account"
    >
      <Stack gap="24">
        <SignUp />
        <Stack direction="row" gap="16">
          <Link asChild size="tiny">
            <RouterLink to={ROUTES.SIGN_IN}>Log in</RouterLink>
          </Link>
          <Link asChild size="tiny">
            <RouterLink to={ROUTES.RESET_PASSWORD}>Forgot password?</RouterLink>
          </Link>
        </Stack>
      </Stack>
    </Page>
  );
}
