import type { PrismaClient } from "@/generated/prisma/client";
import type { DeepMockProxy } from "vitest-mock-extended";
import { mockDeep, mockReset } from "vitest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

export type PrismaMockType = DeepMockProxy<PrismaClient>;
