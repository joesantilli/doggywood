import { IdentityProvider, Prisma } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { getPrisma } from "@/lib/db";
import {
  createUserForIdentity,
  findUserByExternalIdentity,
  linkIdentityToUser,
  resolveIdentity,
} from "@/server/auth/identity";

const prisma = getPrisma();

function unique(label: string) {
  return `p01-ident-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

describe("identity mapping", () => {
  const createdUserIds: string[] = [];

  afterAll(async () => {
    if (createdUserIds.length === 0) {
      return;
    }
    await prisma.authIdentity.deleteMany({ where: { userId: { in: createdUserIds } } });
    await prisma.session.deleteMany({ where: { userId: { in: createdUserIds } } });
    await prisma.dog.deleteMany({ where: { ownerUserId: { in: createdUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  });

  it("exposes LOCAL and VERIFY_DOG providers and no password field", () => {
    expect(IdentityProvider.LOCAL).toBe("LOCAL");
    expect(IdentityProvider.VERIFY_DOG).toBe("VERIFY_DOG");
    expect(Object.keys(Prisma.UserScalarFieldEnum)).not.toContain("password");
    expect(Object.keys(Prisma.UserScalarFieldEnum)).not.toContain("passwordHash");
  });

  it("lets a User exist without an identity provider record", async () => {
    const user = await prisma.user.create({
      data: { email: `${unique("orphan")}@doggywood.test`, firstName: "Orphan" },
    });
    createdUserIds.push(user.id);

    const identities = await prisma.authIdentity.findMany({ where: { userId: user.id } });
    expect(identities).toHaveLength(0);
    expect(user.email).toBeTruthy();
  });

  it("maps a LOCAL identity to a Doggywood User", async () => {
    const subject = unique("local");
    const user = await resolveIdentity(
      {
        provider: "LOCAL",
        providerSubject: subject,
        email: `${unique("mapped")}@doggywood.test`,
      },
      { firstName: "Local", lastName: "Owner" },
    );
    createdUserIds.push(user.id);

    const found = await findUserByExternalIdentity("LOCAL", subject);
    expect(found?.id).toBe(user.id);

    const again = await resolveIdentity({
      provider: "LOCAL",
      providerSubject: subject,
    });
    expect(again.id).toBe(user.id);
  });

  it("can later attach a VERIFY_DOG identity to the same User", async () => {
    const user = await createUserForIdentity(
      {
        provider: "LOCAL",
        providerSubject: unique("link-local"),
        email: `${unique("link")}@doggywood.test`,
      },
      { firstName: "Linked" },
    );
    createdUserIds.push(user.id);

    const verifySubject = unique("verify-dog");
    await linkIdentityToUser(user.id, {
      provider: "VERIFY_DOG",
      providerSubject: verifySubject,
    });

    const fromVerify = await findUserByExternalIdentity("VERIFY_DOG", verifySubject);
    expect(fromVerify?.id).toBe(user.id);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: unique("token-hash"),
        expiresAt: new Date(Date.now() + 60_000),
      },
    });
    expect(session.userId).toBe(user.id);
  });

  it("lets a Dog exist without an external dog id", async () => {
    const user = await prisma.user.create({
      data: { email: `${unique("dog-owner")}@doggywood.test` },
    });
    createdUserIds.push(user.id);
    const dog = await prisma.dog.create({
      data: { ownerUserId: user.id, name: "No External Id" },
    });
    expect(dog.externalDogId).toBeNull();
  });

  it("rejects a duplicate provider plus providerSubject", async () => {
    const subject = unique("dup");
    const user = await createUserForIdentity({
      provider: "LOCAL",
      providerSubject: subject,
      email: `${unique("dup")}@doggywood.test`,
    });
    createdUserIds.push(user.id);

    const other = await prisma.user.create({
      data: { email: `${unique("other")}@doggywood.test` },
    });
    createdUserIds.push(other.id);

    try {
      await prisma.authIdentity.create({
        data: {
          userId: other.id,
          provider: "LOCAL",
          providerSubject: subject,
        },
      });
      throw new Error("expected unique constraint on provider+providerSubject");
    } catch (error) {
      expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
      expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
    }
  });
});
