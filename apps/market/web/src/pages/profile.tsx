import Head from "next/head";
import type { InferGetServerSidePropsType } from "next";
import { tryCatchAsync } from "@workspace/utils";
import { getAdminHello, getAuthHello, getHello } from "../api";
import { withSession } from "../server/withSession";

export const getServerSideProps = withSession(async (ctx) => {
  const headers = { cookie: ctx.req.headers.cookie ?? "" };
  const [
    [hello, helloError],
    [authHello, authHelloError],
    [adminHello, adminHelloError],
  ] = await Promise.all([
    tryCatchAsync(getHello()),
    tryCatchAsync(getAuthHello({ headers })),
    tryCatchAsync(getAdminHello({ headers })),
  ]);
  if (helloError) {
    console.error("Hello unavailable:", helloError);
  }
  if (authHelloError) {
    console.error("Auth hello unavailable:", authHelloError);
  }
  if (adminHelloError) {
    console.error("Admin hello unavailable:", adminHelloError);
  }

  return {
    props: {
      message: hello?.message ?? null,
      authMessage: authHello?.message ?? null,
      adminMessage: adminHello?.message ?? null,
    },
  };
});

export default function ProfilePage({
  message,
  authMessage,
  adminMessage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Profile · Market</title>
      </Head>
      <h1>Profile</h1>
      <p>{message ?? "Couldn't load the message."}</p>
      <p>{authMessage ?? "Couldn't load the authenticated message."}</p>
      <p>{adminMessage ?? "You are not an admin."}</p>
    </>
  );
}
