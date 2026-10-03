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

/**
 * Password reset updates Account via updateMany, whose after-hook payload is
 * `{ count }` rather than the account row. Copy the credential hash onto User.
 *
 * @param {{ id?: string }} user
 */
export const syncUserPasswordFromCredentialAccount = async (user) => {
  if (!user?.id) {
    return;
  }

  const account = await db.account.findFirst({
    where: { userId: user.id, provider: "credential" },
  });

  if (!account?.password) {
    return;
  }

  await db.user.update({
    where: { id: user.id },
    data: { password: account.password },
  });
};

/**
 * Better Auth maps `emailVerified` onto `emailVerifiedBool`. Also stamp
 * `User.emailVerified` (DateTime) so passport/nextauth still see a verified user.
 *
 * @param {{ id?: string }} user
 */
export const syncEmailVerifiedAt = async (user) => {
  if (!user?.id) {
    return;
  }

  await db.user.updateMany({
    where: { id: user.id, emailVerified: null },
    data: { emailVerified: new Date() },
  });
};