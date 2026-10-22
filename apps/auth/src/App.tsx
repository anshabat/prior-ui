import { Routes, Route } from "react-router-dom";
import { ReactQueryProvider } from "./context/ReactQueryContext";
import { LoginPage } from "./pages/LoginPage.tsx";
import SessionLogoutPage from "./pages/LogoutPage.tsx";

function App() {
  return (
    <ReactQueryProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logout" element={<SessionLogoutPage />} />
      </Routes>
    </ReactQueryProvider>
  );
}

export default App;
