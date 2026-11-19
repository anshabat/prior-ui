import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { AuthSession } from "@workspace/api-auth";
import { tryCatchAsync } from "@workspace/utils";
import { getHello, getSession } from "../api";

export const getServerSideProps: GetServerSideProps<{
  session: AuthSession | null;
  message: string | null;
}> = async ({ req }) => {
  const [[session, sessionError], [hello, helloError]] = await Promise.all([
    tryCatchAsync(
      getSession({ headers: { cookie: req.headers.cookie ?? "" } }),
    ),
    tryCatchAsync(getHello()),
  ]);
  if (sessionError) {
    console.error("Session unavailable, rendering logged out:", sessionError);
  }
  if (helloError) {
    console.error("Hello unavailable:", helloError);
  }

  return {
    props: { session: session ?? null, message: hello?.message ?? null },
  };
};

export default function ProfilePage({
  message,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Profile · Market</title>
      </Head>
      <h1>Profile</h1>
      <p>{message ?? "Couldn't load the message."}</p>
    </>
  );
}
