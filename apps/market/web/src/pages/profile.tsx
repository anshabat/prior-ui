import Head from "next/head";
import type { InferGetServerSidePropsType } from "next";
import { tryCatchAsync } from "@workspace/utils";
import { getAuthHello, getHello } from "../api";
import { withSession } from "../server/withSession";

export const getServerSideProps = withSession(async (ctx) => {
  const [[hello, helloError], [authHello, authHelloError]] = await Promise.all([
    tryCatchAsync(getHello()),
    tryCatchAsync(
      getAuthHello({ headers: { cookie: ctx.req.headers.cookie ?? "" } }),
    ),
  ]);
  if (helloError) {
    console.error("Hello unavailable:", helloError);
  }
  if (authHelloError) {
    console.error("Auth hello unavailable:", authHelloError);
  }

  return {
    props: {
      message: hello?.message ?? null,
      authMessage: authHello?.message ?? null,
    },
  };
});

export default function ProfilePage({
  message,
  authMessage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Profile · Market</title>
      </Head>
      <h1>Profile</h1>
      <p>{message ?? "Couldn't load the message."}</p>
      <p>{authMessage ?? "Couldn't load the authenticated message."}</p>
    </>
  );
}
