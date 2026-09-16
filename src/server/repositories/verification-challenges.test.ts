import { afterAll, describe, expect, it } from "vitest";
import { getPrisma } from "@/lib/db";
import { verificationChallengeRepository } from "@/server/repositories/verification-challenges";

const prisma = getPrisma();

function unique(label: string) {
  return `p03-repo-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

describe("verification challenge repository", () => {
  const createdIds: string[] = [];

  afterAll(async () => {
    if (createdIds.length === 0) {
      return;
    }
    await prisma.verificationChallenge.deleteMany({ where: { id: { in: createdIds } } });
  });

  it("creates an EMAIL challenge with a code hash", async () => {
    const challenge = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination: `${unique("email")}@doggywood.test`,
      codeHash: "abc123hash",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(challenge.id);

    expect(challenge.channel).toBe("EMAIL");
    expect(challenge.codeHash).toBe("abc123hash");
    expect(challenge.twilioSid).toBeNull();
    expect(challenge.attemptCount).toBe(0);
    expect(challenge.requestCount).toBe(1);
  });

  it("creates an SMS challenge with a null code hash", async () => {
    const challenge = await verificationChallengeRepository.createVerificationChallenge({
      channel: "SMS",
      destination: `+1555${Date.now().toString().slice(-7)}`,
      twilioSid: "VA-test-sid",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(challenge.id);

    expect(challenge.channel).toBe("SMS");
    expect(challenge.codeHash).toBeNull();
    expect(challenge.twilioSid).toBe("VA-test-sid");
  });

  it("finds a challenge by id", async () => {
    const created = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination: `${unique("find")}@doggywood.test`,
      codeHash: "find-hash",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(created.id);

    const found = await verificationChallengeRepository.findVerificationChallengeById(created.id);
    expect(found?.id).toBe(created.id);
    expect(found?.destination).toBe(created.destination);
  });

  it("finds the latest active challenge", async () => {
    const destination = `${unique("latest")}@doggywood.test`;
    const older = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "older",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    const newer = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "newer",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(older.id, newer.id);

    const latest = await verificationChallengeRepository.findLatestActiveChallenge(
      "EMAIL",
      destination,
    );
    expect(latest?.id).toBe(newer.id);
  });

  it("does not treat an expired challenge as active", async () => {
    const destination = `${unique("expired")}@doggywood.test`;
    const expired = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "expired",
      expiresAt: new Date(Date.now() - 1000),
    });
    createdIds.push(expired.id);

    expect(
      await verificationChallengeRepository.findLatestActiveChallenge("EMAIL", destination),
    ).toBeNull();
  });

  it("does not treat a consumed challenge as active", async () => {
    const destination = `${unique("consumed")}@doggywood.test`;
    const consumed = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "consumed",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(consumed.id);
    await verificationChallengeRepository.consumeVerificationChallenge(consumed.id);

    expect(
      await verificationChallengeRepository.findLatestActiveChallenge("EMAIL", destination),
    ).toBeNull();
  });

  it("does not treat an invalidated challenge as active", async () => {
    const destination = `${unique("invalid")}@doggywood.test`;
    const invalidated = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "invalidated",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(invalidated.id);
    await verificationChallengeRepository.invalidateActiveChallenges("EMAIL", destination);

    expect(
      await verificationChallengeRepository.findLatestActiveChallenge("EMAIL", destination),
    ).toBeNull();
  });

  it("invalidates older active challenges for the same destination", async () => {
    const destination = `${unique("invalidate")}@doggywood.test`;
    const first = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "first",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(first.id);

    await verificationChallengeRepository.invalidateActiveChallenges("EMAIL", destination);
    const after = await verificationChallengeRepository.findVerificationChallengeById(first.id);
    expect(after?.invalidatedAt).not.toBeNull();
    expect(
      await verificationChallengeRepository.findLatestActiveChallenge("EMAIL", destination),
    ).toBeNull();
  });

  it("atomically increments the attempt count", async () => {
    const challenge = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination: `${unique("attempt")}@doggywood.test`,
      codeHash: "attempt",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(challenge.id);

    const once = await verificationChallengeRepository.incrementVerificationAttempt(challenge.id);
    const twice = await verificationChallengeRepository.incrementVerificationAttempt(challenge.id);
    expect(once.attemptCount).toBe(1);
    expect(twice.attemptCount).toBe(2);
  });

  it("consumes an active challenge and leaves historical rows", async () => {
    const destination = `${unique("consume")}@doggywood.test`;
    const historical = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "old",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    await verificationChallengeRepository.invalidateActiveChallenges("EMAIL", destination);
    const active = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "new",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(historical.id, active.id);

    const consumed = await verificationChallengeRepository.consumeVerificationChallenge(active.id);
    expect(consumed?.consumedAt).not.toBeNull();
    expect(
      await verificationChallengeRepository.consumeVerificationChallenge(active.id),
    ).toBeNull();
    expect(
      await verificationChallengeRepository.findLatestActiveChallenge("EMAIL", destination),
    ).toBeNull();

    const remaining = await prisma.verificationChallenge.findMany({
      where: { channel: "EMAIL", destination },
    });
    expect(remaining).toHaveLength(2);
  });

  it("counts recent challenges by destination and IP", async () => {
    const destination = `${unique("count")}@doggywood.test`;
    const ipAddress = "203.0.113.10";
    const recent = await verificationChallengeRepository.createVerificationChallenge({
      channel: "EMAIL",
      destination,
      codeHash: "recent",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ipAddress,
    });
    createdIds.push(recent.id);

    const since = new Date(Date.now() - 60 * 1000);
    expect(
      await verificationChallengeRepository.countRecentChallengesForDestination(
        "EMAIL",
        destination,
        since,
      ),
    ).toBe(1);
    expect(
      await verificationChallengeRepository.countRecentChallengesForIp(ipAddress, since),
    ).toBeGreaterThanOrEqual(1);
    expect(
      await verificationChallengeRepository.countRecentChallengesForDestination(
        "EMAIL",
        destination,
        new Date(Date.now() + 60 * 1000),
      ),
    ).toBe(0);
  });

  it("stores a Twilio SID on the intended SMS challenge only", async () => {
    const challenge = await verificationChallengeRepository.createVerificationChallenge({
      channel: "SMS",
      destination: `+1555${Date.now().toString().slice(-7)}`,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    createdIds.push(challenge.id);
    expect(challenge.twilioSid).toBeNull();

    const updated = await verificationChallengeRepository.setVerificationChallengeTwilioSid(
      challenge.id,
      "VErepo-only-sid",
    );
    expect(updated.id).toBe(challenge.id);
    expect(updated.twilioSid).toBe("VErepo-only-sid");
    expect(updated.codeHash).toBeNull();
  });
});
