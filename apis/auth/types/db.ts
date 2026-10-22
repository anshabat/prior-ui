import type { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{}>;
export type Account = Prisma.AccountGetPayload<{}>;
export type TwoFactorToken = Prisma.TwoFactorTokenGetPayload<{}>;
export type VerificationToken = Prisma.VerificationTokenGetPayload<{}>;
export type PasswordResetToken = Prisma.PasswordResetTokenGetPayload<{}>;

export type CreateUserData = Prisma.UserCreateInput;
export type CreateAccountData = Prisma.AccountUncheckedCreateInput;