import { Routes, Route } from "react-router-dom";
import { ReactQueryProvider } from "./context/ReactQueryContext";
import { Layout } from "./components/ui/Layout.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import SessionLogoutPage from "./pages/LogoutPage.tsx";

function App() {
  return (
    <ReactQueryProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/logout" element={<SessionLogoutPage />} />
        </Route>
      </Routes>
    </ReactQueryProvider>
  );
}

export default App;
