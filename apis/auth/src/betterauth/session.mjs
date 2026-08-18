/**
 * @param {{
 *   user?: {
 *     id: string;
 *     name?: string | null;
 *     email: string;
 *     image?: string | null;
 *     role?: string | null;
 *     provider?: string | null;
 *   };
 *   session?: { expiresAt: Date | string };
 * } | null | undefined} ba
 * @returns {import('../../types').AuthSession | null}
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
      provider: ba.user.provider ?? null,
    },
    expires:
      ba.session.expiresAt instanceof Date
        ? ba.session.expiresAt.toISOString()
        : String(ba.session.expiresAt),
  };
}
