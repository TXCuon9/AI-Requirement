"use client";

import { useState } from "react";
import { type AuthSession } from "../types";

export function useAuth() {
  const [session, setSession] = useState<AuthSession>({ user: null });

  return {
    session,
    setSession,
    isAuthenticated: Boolean(session.user),
  };
}
