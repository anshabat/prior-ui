import db from "../lib/db.js";

/**
 * Better Auth keeps the hash on Account. Copy it to User.password so
 * passport/nextauth credentials can verify the same user.
 *
 * @param {{ providerId?: string, password?: string | null, userId?: string }} account
 */
export const syncCredentialPasswordToUser = async (account) => {
  if (account.providerId !== "credential" || !account.password || !account.userId) {
    return;
  }

  await db.user.update({
    where: { id: account.userId },
    data: { password: account.password },
  });
};