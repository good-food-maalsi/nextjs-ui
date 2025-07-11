"use client";

import { sessionStore } from "@/lib/session/session-store";
import { Session } from "@/lib/types/session.types";
import { useEffect } from "react";

export function SessionHydrater({ session }: { session: Session }) {
  useEffect(() => {
    sessionStore.set(session);
  }, [session]);

  return null;
}
