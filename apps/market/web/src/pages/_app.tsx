import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Pages return `session` from getServerSideProps.
    // Pages without it (e.g. 404) count as logged out.
    <Layout session={pageProps.session ?? null}>
      <Component {...pageProps} />
    </Layout>
  );
}
