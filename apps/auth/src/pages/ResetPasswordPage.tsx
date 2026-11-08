import { Link as RouterLink } from "react-router-dom";
import { Link, Stack } from "@workspace/ui";
import { ResetPassword } from "../components/ResetPassword/ResetPassword.tsx";
import { Page } from "../components/ui/Page.tsx";
import { ROUTES } from "../constants";

export function ResetPasswordPage() {
  return (
    <Page title="Reset password">
      <Stack gap="24">
        <ResetPassword />
        <Stack direction="row" gap="16">
          <Link asChild size="tiny">
            <RouterLink to={ROUTES.SIGN_IN}>Back to log in</RouterLink>
          </Link>
          <Link asChild size="tiny">
            <RouterLink to={ROUTES.SIGN_UP}>Create account</RouterLink>
          </Link>
        </Stack>
      </Stack>
    </Page>
  );
}
