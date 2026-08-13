import type { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{}>;
export type TwoFactorToken = Prisma.TwoFactorTokenGetPayload<{}>;
export type VerificationToken = Prisma.VerificationTokenGetPayload<{}>;
export type PasswordResetToken = Prisma.PasswordResetTokenGetPayload<{}>;
