import { type UserRole } from "@types";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
};
