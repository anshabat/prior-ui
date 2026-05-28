import { Routes, Route } from "react-router-dom";
import { ReactQueryProvider } from "./context/ReactQueryContext";
import { SessionModule } from "./modules/session/SessionModule";
import { NextAuthModule } from "./modules/nextauth/NextAuthModule";
import SessionLogoutPage from "./modules/session/LogoutPage";
import NextAuthLogoutPage from "./modules/nextauth/LogoutPage";
import { config } from "@workspace/config";

const { AUTH_STRATEGY } = config.auth;

const moduleMap = {
  passport: SessionModule,
  nextauth: NextAuthModule,
};

const logoutPageMap = {
  passport: SessionLogoutPage,
  nextauth: NextAuthLogoutPage,
};

const ModuleComponent = moduleMap[AUTH_STRATEGY as keyof typeof moduleMap];
const LogoutPage = logoutPageMap[AUTH_STRATEGY as keyof typeof logoutPageMap];

function App() {
  return (
    <ReactQueryProvider>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "16px 32px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {AUTH_STRATEGY}
        </div>

        <div style={{ padding: 32 }}>
          <Routes>
            <Route path="/" element={<ModuleComponent />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </div>
      </div>
    </ReactQueryProvider>
  );
}

export default App;
