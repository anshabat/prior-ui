/**
 * @typedef {import('../../types').AuthSession} AuthSession
 * @typedef {import('@prisma/client').User} PrismaUser
 */

/**
 * @param {{
 *   user?: {
 *     id: string;
 *     name?: string | null;
 *     email: string;
 *     image?: string | null;
 *     role?: string | null;
 *     provider?: string | null;
 *     lastLoginMethod?: PrismaUser["lastLoginMethod"];
 *   };
 *   session?: { expiresAt: Date | string };
 *   accounts?: { providerId?: string, provider?: string }[];
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
