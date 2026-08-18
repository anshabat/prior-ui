/**
 * @typedef {import('../../types').AuthSession} AuthSession
 * @typedef {import("better-auth").User} BetterAuthUser
 * @typedef {import("better-auth").Session} BetterAuthSession
 * @typedef {import("better-auth").Account} BetterAuthAccount
 * @typedef {import('@prisma/client').User} PrismaUser
 * @typedef {BetterAuthUser & {
 *   lastLoginMethod?: string | null;
 *   role?: string | null;
 *   isTwoFactorEnabled?: boolean | null;
 * }} BetterAuthSessionUser
 */

/**
 * @param {{
 *   user?: BetterAuthSessionUser;
 *   session?: BetterAuthSession;
 *   accounts?: BetterAuthAccount[];
 * } | null | undefined} ba
 * @returns {AuthSession | null}
 */
export function toAuthSession(ba) {
  if (!ba?.user || !ba.session) return null;

  return {
    user: {
      id: ba.user.id,
      name: ba.user.name ?? null,
      email: ba.user.email,
      image: ba.user.image ?? null,
      role: ba.user.role ?? null,
      provider: ba.user.lastLoginMethod ?? null,
    },
    expires:
      ba.session.expiresAt instanceof Date
        ? ba.session.expiresAt.toISOString()
        : String(ba.session.expiresAt),
  };
}
