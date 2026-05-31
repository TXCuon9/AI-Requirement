import { type UserRole } from "@types";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
};

export type AuthSession = {
  user: AuthUser | null;
  token?: string;
};
