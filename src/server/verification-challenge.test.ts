import { IdentityProvider, Prisma } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { getPrisma } from "@/lib/db";

const prisma = getPrisma();

function unique(label: string) {
  return `p03-verify-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

describe("public identity verification schema", () => {
  const createdChallengeIds: string[] = [];

  afterAll(async () => {
    if (createdChallengeIds.length === 0) {
      return;
    }
    await prisma.verificationChallenge.deleteMany({
      where: { id: { in: createdChallengeIds } },
    });
  });

  it("exposes EMAIL and PHONE identity providers alongside LOCAL and VERIFY_DOG", () => {
    expect(IdentityProvider.LOCAL).toBe("LOCAL");
    expect(IdentityProvider.EMAIL).toBe("EMAIL");
    expect(IdentityProvider.PHONE).toBe("PHONE");
    expect(IdentityProvider.VERIFY_DOG).toBe("VERIFY_DOG");
    expect(Object.keys(Prisma.UserScalarFieldEnum)).not.toContain("password");
    expect(Object.keys(Prisma.UserScalarFieldEnum)).not.toContain("passwordHash");
  });

  it("stores an email challenge with a code hash", async () => {
    const challenge = await prisma.verificationChallenge.create({
      data: {
        channel: "EMAIL",
        destination: `${unique("email")}@doggywood.test`,
        codeHash: "sha256-not-a-real-code",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    createdChallengeIds.push(challenge.id);

    expect(challenge.channel).toBe("EMAIL");
    expect(challenge.codeHash).toBe("sha256-not-a-real-code");
    expect(challenge.twilioSid).toBeNull();
    expect(challenge.attemptCount).toBe(0);
    expect(challenge.requestCount).toBe(1);
    expect(challenge.consumedAt).toBeNull();
    expect(challenge.invalidatedAt).toBeNull();
  });

  it("stores an SMS challenge without a local code hash", async () => {
    const challenge = await prisma.verificationChallenge.create({
      data: {
        channel: "SMS",
        destination: `+1555${Date.now().toString().slice(-7)}`,
        twilioSid: "VA-placeholder-sid",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    createdChallengeIds.push(challenge.id);

    expect(challenge.channel).toBe("SMS");
    expect(challenge.codeHash).toBeNull();
    expect(challenge.twilioSid).toBe("VA-placeholder-sid");
    expect(challenge.attemptCount).toBe(0);
    expect(challenge.requestCount).toBe(1);
  });

  it("allows multiple historical challenges for the same destination", async () => {
    const destination = `${unique("repeat")}@doggywood.test`;
    const first = await prisma.verificationChallenge.create({
      data: {
        channel: "EMAIL",
        destination,
        codeHash: "hash-one",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    const second = await prisma.verificationChallenge.create({
      data: {
        channel: "EMAIL",
        destination,
        codeHash: "hash-two",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    createdChallengeIds.push(first.id, second.id);

    const rows = await prisma.verificationChallenge.findMany({
      where: { channel: "EMAIL", destination },
    });
    expect(rows).toHaveLength(2);
  });
});
