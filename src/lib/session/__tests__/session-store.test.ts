import { describe, expect,it } from "vitest";

import { sessionStore } from "../session-store";

describe("sessionStore", () => {
  it("should set and get a session", () => {
    const session = {
      sub: "12345",
      username: "test",
      role: "admin",
      picture: "profile.jpg",
      email: "testuser@example.com",
    };

    sessionStore.set(session);
    expect(sessionStore.get()).toEqual(session);
  });
});
