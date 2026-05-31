import { type AuthSession } from "../types";

export async function signIn(email: string, _password: string): Promise<AuthSession> {
  return {
    user: {
      id: "user-1",
      email,
      role: "candidate",
    },
    token: "mock-token",
  };
}

export async function signOut(): Promise<void> {
  return;
}
