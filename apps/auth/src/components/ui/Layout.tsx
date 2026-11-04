import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Outlet />
    </main>
  );
}
