import { Outlet } from "react-router-dom";
import { Logo } from "@workspace/ui";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Logo />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
