import Head from "next/head";
import type { InferGetServerSidePropsType } from "next";
import { tryCatchAsync } from "@workspace/utils";
import { getHello } from "../api";
import { withSession } from "../server/withSession";

export const getServerSideProps = withSession(async () => {
  const [hello, helloError] = await tryCatchAsync(getHello());
  if (helloError) {
    console.error("Hello unavailable:", helloError);
  }

  return { props: { message: hello?.message ?? null } };
});

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
