export type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string | null;
  provider: string | null;
};
