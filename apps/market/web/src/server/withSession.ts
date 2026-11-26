import type { GetServerSideProps } from "next";
import type { AuthSession } from "@workspace/api-auth";
import { tryCatchAsync } from "@workspace/utils";
import { getSession } from "../api";

type SessionProps = {
  session: AuthSession | null;
};

export function withSession<P extends Record<string, unknown>>(
  gssp: GetServerSideProps<P> = async () => ({ props: {} as P }),
): GetServerSideProps<P & SessionProps> {
  return async (ctx) => {
    const [session, result] = await Promise.all([
      readSession(ctx.req.headers.cookie),
      gssp(ctx),
    ]);

    // redirect / notFound pass through unchanged
    if (!("props" in result)) {
      return result;
    }

    return { props: { ...(await result.props), session } };
  };
}

async function readSession(
  cookie: string | undefined,
): Promise<AuthSession | null> {
  const [session, error] = await tryCatchAsync(
    getSession({ headers: { cookie: cookie ?? "" } }),
  );
  if (error) {
    console.error("Session unavailable, rendering logged out:", error);
  }
  return session ?? null;
}
