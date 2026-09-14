import { Prisma } from "@prisma/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getPrisma } from "@/lib/db";
import { contestService } from "@/server/services/contest";

const prisma = getPrisma();

function unique(label: string) {
  return `p01-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

describe("database constraints and current contest", () => {
  let userId: string;
  let otherUserId: string;
  let dogId: string;
  let contestId: string;
  let currentSlug: string;

  beforeAll(async () => {
    const owner = await prisma.user.create({
      data: { email: `${unique("owner")}@doggywood.test`, firstName: "Constraint" },
    });
    const voter = await prisma.user.create({
      data: { email: `${unique("voter")}@doggywood.test`, firstName: "Voter" },
    });
    const dog = await prisma.dog.create({
      data: { ownerUserId: owner.id, name: "Constraint Dog" },
    });
    const now = new Date();
    currentSlug = unique("contest");
    const contest = await prisma.contest.create({
      data: {
        name: "Constraint Contest",
        slug: currentSlug,
        status: "OPEN",
        startsAt: new Date(now.getTime() - 60_000),
        entryClosesAt: new Date(now.getTime() + 60_000 * 60),
        votingClosesAt: new Date(now.getTime() + 60_000 * 120),
        rulesVersion: "dev-1",
      },
    });
    userId = owner.id;
    otherUserId = voter.id;
    dogId = dog.id;
    contestId = contest.id;
  });

  afterAll(async () => {
    await prisma.vote.deleteMany({
      where: { contest: { slug: { startsWith: "p01-" } } },
    });
    await prisma.entry.deleteMany({
      where: { contest: { slug: { startsWith: "p01-" } } },
    });
    await prisma.contest.deleteMany({ where: { slug: { startsWith: "p01-" } } });
    await prisma.dog.deleteMany({
      where: { owner: { email: { endsWith: "@doggywood.test" } } },
    });
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { endsWith: "@doggywood.test" } },
          { phoneE164: { startsWith: "+1555" } },
        ],
      },
    });
  });

  it("selects an OPEN contest whose entry window includes now", async () => {
    const now = new Date();
    await prisma.contest.create({
      data: {
        name: "Closed Window",
        slug: unique("closed"),
        status: "OPEN",
        startsAt: new Date(now.getTime() - 120_000),
        entryClosesAt: new Date(now.getTime() - 60_000),
        votingClosesAt: new Date(now.getTime() + 60_000),
        rulesVersion: "dev-1",
      },
    });
    await prisma.contest.create({
      data: {
        name: "Draft Contest",
        slug: unique("draft"),
        status: "DRAFT",
        startsAt: new Date(now.getTime() - 60_000),
        entryClosesAt: new Date(now.getTime() + 60_000),
        votingClosesAt: new Date(now.getTime() + 120_000),
        rulesVersion: "dev-1",
      },
    });

    const current = await contestService.getCurrentContest(now);
    expect(current?.slug).toBe(currentSlug);
    expect(await contestService.getContestBySlug(currentSlug)).not.toBeNull();
  });

  it("rejects a second entry for the same dog in the same contest", async () => {
    await prisma.entry.create({
      data: {
        contestId,
        dogId,
        userId,
        slug: unique("entry"),
      },
    });

    try {
      await prisma.entry.create({
        data: {
          contestId,
          dogId,
          userId,
          slug: unique("entry-dup"),
        },
      });
      throw new Error("expected unique constraint on contestId+dogId");
    } catch (error) {
      expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
      expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
    }
  });

  it("rejects a second vote by the same user on the same entry", async () => {
    const entry = await prisma.entry.findFirstOrThrow({ where: { contestId, dogId } });
    await prisma.vote.create({
      data: { contestId, entryId: entry.id, voterUserId: otherUserId },
    });

    try {
      await prisma.vote.create({
        data: { contestId, entryId: entry.id, voterUserId: otherUserId },
      });
      throw new Error("expected unique constraint on entryId+voterUserId");
    } catch (error) {
      expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
      expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
    }
  });

  it("rejects a duplicate user email", async () => {
    const email = `${unique("dup")}@doggywood.test`;
    await prisma.user.create({ data: { email } });
    try {
      await prisma.user.create({ data: { email } });
      throw new Error("expected unique email");
    } catch (error) {
      expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
    }
  });

  it("rejects a duplicate user phone number", async () => {
    const phoneE164 = `+1555${Date.now().toString().slice(-7)}`;
    await prisma.user.create({ data: { phoneE164 } });
    try {
      await prisma.user.create({ data: { phoneE164 } });
      throw new Error("expected unique phone");
    } catch (error) {
      expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
    }
  });

  it("rejects a duplicate contest slug", async () => {
    try {
      await prisma.contest.create({
        data: {
          name: "Duplicate Slug",
          slug: currentSlug,
          status: "DRAFT",
          startsAt: new Date(),
          entryClosesAt: new Date(),
          votingClosesAt: new Date(),
          rulesVersion: "dev-1",
        },
      });
      throw new Error("expected unique contest slug");
    } catch (error) {
      expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
    }
  });
});
