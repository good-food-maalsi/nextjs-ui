"use client";

import { useEffect } from "react";

import { sessionStore } from "@/lib/session/session-store";
import type { Session } from "@/lib/types/session.types";

export function SessionHydrater({ session }: { session: Session }) {
  useEffect(() => {
    sessionStore.set(session);
  }, [session]);

  return null;
}
