import { Button } from "@workspace/ui";

export function LogoutButton({
  isLoggedIn,
  onLogout,
  isLoading,
}: {
  isLoggedIn: boolean;
  onLogout: () => void;
  isLoading?: boolean;
}) {

  if (!isLoggedIn) {
    return <div>user is not logged in</div>;
  }

  return (
    <Button type="button" size="medium" onClick={onLogout} disabled={isLoading}>
      Logout
    </Button>
  );
}
