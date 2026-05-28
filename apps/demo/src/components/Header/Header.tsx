import { useSession } from "../../hooks/useSession";
import { useAuthHandlers } from "@workspace/apps-lib/auth/react";

export default function Header() {
  const session = useSession();

  const redirectUrl = encodeURIComponent(window.location.href);
  const { loginHref, logoutHref, openLoginPopup, openLogoutPopup } =
    useAuthHandlers(redirectUrl);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between border-b border-gray-300">
      <nav>
        <ul className="flex space-x-4 gap-4">
          <li>
            <a href="/" className="underline">
              Home
            </a>
          </li>
          {session ? (
            <>
              <li>Hi {session.user.email}</li>
              <li>
                <button onClick={openLogoutPopup} className="underline">
                  Logout popup
                </button>
              </li>
              <li>
                <a href={logoutHref} className="underline">
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={openLoginPopup} className="underline">
                  Login popup
                </button>
              </li>
              <li>
                <a href={loginHref} className="underline">
                  Login
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div>
        {session?.user.email} - {session?.user.provider}
      </div>
    </header>
  );
}
