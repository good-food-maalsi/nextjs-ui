import { Session } from "@/lib/types/session.types";
import { sessionState } from "@/lib/config/session.config";

export const sessionStore = {
  get: () => sessionState.get(),
  set: (session: Session) => sessionState.set(session),
  update: (partialSession: Partial<Session>) =>
    sessionState.assign(partialSession),
  clear: () => sessionState.set({}),
};
