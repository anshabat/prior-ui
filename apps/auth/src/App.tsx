import { Routes, Route } from "react-router-dom";
import { ReactQueryProvider } from "./context/ReactQueryContext";
import { SessionModule } from "./modules/session/SessionModule";
import SessionLogoutPage from "./modules/session/LogoutPage";

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
          Auth
        </div>

        <div style={{ padding: 32 }}>
          <Routes>
            <Route path="/" element={<SessionModule />} />
            <Route path="/logout" element={<SessionLogoutPage />} />
          </Routes>
        </div>
      </div>
    </ReactQueryProvider>
  );
}

export default App;
