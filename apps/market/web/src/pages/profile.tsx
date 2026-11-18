import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { config } from "@workspace/config";

const { API_BASE_URL } = config.market;

// Mirrors HelloResponse in market-api (legacy, so types can't be shared)
type HelloResponse = {
  message: string;
};

type ProfileProps = {
  message: string;
};

export const getServerSideProps = (async () => {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    // Thrown errors render Next's 500 page
    throw new Error(`market-api GET / failed: ${response.status}`);
  }
  const { message }: HelloResponse = await response.json();
  return { props: { message } };
}) satisfies GetServerSideProps<ProfileProps>;

export default function ProfilePage({
  message,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Profile · Market</title>
      </Head>
      <h1>Profile</h1>
      <p>{message}</p>
    </>
  );
}
