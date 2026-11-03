import { Routes, Route } from "react-router-dom";
import { ReactQueryProvider } from "./context/ReactQueryContext";
import { ROUTES } from "./constants";
import { Layout } from "./components/ui/Layout.tsx";
import { RequireAuth } from "./components/guards/RequireAuth.tsx";
import { RequireGuest } from "./components/guards/RequireGuest.tsx";
import { SignInPage } from "./pages/SignInPage.tsx";
import { SignUpPage } from "./pages/SignUpPage.tsx";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.tsx";
import { AccountPage } from "./pages/AccountPage.tsx";
import SessionLogoutPage from "./pages/LogoutPage.tsx";

function App() {
  return (
    <ReactQueryProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<RequireGuest />}>
            <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
          </Route>
          <Route path={ROUTES.LOGOUT} element={<SessionLogoutPage />} />
        </Route>
      </Routes>
    </ReactQueryProvider>
  );
}

export default App;
