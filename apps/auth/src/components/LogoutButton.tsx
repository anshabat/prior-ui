export function LogoutButton({
  isLoggedIn,
  onLogout,
  isLoading,
}: {
  isLoggedIn: boolean;
  onLogout: () => void;
  isLoading?: boolean;
}) {
  console.log("isLoading", isLoading);

  if (!isLoggedIn) {
    return <div>user is not logged in</div>;
  }

  return (
    <button onClick={onLogout} disabled={isLoading}>
      Logout
    </button>
  );
}
