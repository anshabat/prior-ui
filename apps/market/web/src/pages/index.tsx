import Head from "next/head";
import type { GetServerSideProps } from "next";
import type { AuthSession } from "@workspace/api-auth";
import { tryCatchAsync } from "@workspace/utils";
import { getSession } from "../api";

export const getServerSideProps: GetServerSideProps<{
  session: AuthSession | null;
}> = async ({ req }) => {
  const [session, sessionError] = await tryCatchAsync(
    getSession({ headers: { cookie: req.headers.cookie ?? "" } }),
  );
  if (sessionError) {
    console.error("Session unavailable, rendering logged out:", sessionError);
  }

  return { props: { session: session ?? null } };
};

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Market</title>
      </Head>
      <h1>Market</h1>
    </>
  );
}
