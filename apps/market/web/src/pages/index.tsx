import Head from "next/head";
import { withSession } from "../server/withSession";

export const getServerSideProps = withSession();

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
