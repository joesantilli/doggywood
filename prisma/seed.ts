import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const startsAt = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const entryClosesAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const votingClosesAt = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

  const admin = await prisma.user.upsert({
    where: { email: "admin@doggywood.local" },
    update: { role: "ADMIN", firstName: "Local", lastName: "Admin" },
    create: {
      role: "ADMIN",
      firstName: "Local",
      lastName: "Admin",
      email: "admin@doggywood.local",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@doggywood.local" },
    update: { firstName: "Sample", lastName: "Owner" },
    create: {
      role: "USER",
      firstName: "Sample",
      lastName: "Owner",
      email: "user@doggywood.local",
    },
  });

  const existingDog = await prisma.dog.findFirst({
    where: { ownerUserId: user.id, name: "Local Dog" },
  });
  const dog =
    existingDog ??
    (await prisma.dog.create({
      data: { ownerUserId: user.id, name: "Local Dog" },
    }));

  const contest = await prisma.contest.upsert({
    where: { slug: "local-development" },
    update: {
      name: "Local Development Contest",
      status: "OPEN",
      startsAt,
      entryClosesAt,
      votingClosesAt,
      prizeAmountCents: 50000,
      currency: "USD",
      rulesVersion: "dev-1",
    },
    create: {
      name: "Local Development Contest",
      slug: "local-development",
      status: "OPEN",
      startsAt,
      entryClosesAt,
      votingClosesAt,
      prizeAmountCents: 50000,
      currency: "USD",
      rulesVersion: "dev-1",
    },
  });

  await prisma.authIdentity.upsert({
    where: {
      provider_providerSubject: {
        provider: "LOCAL",
        providerSubject: "local_admin",
      },
    },
    update: { userId: admin.id, email: admin.email },
    create: {
      userId: admin.id,
      provider: "LOCAL",
      providerSubject: "local_admin",
      email: admin.email,
    },
  });

  await prisma.authIdentity.upsert({
    where: {
      provider_providerSubject: {
        provider: "LOCAL",
        providerSubject: "local_sample_user",
      },
    },
    update: { userId: user.id, email: user.email },
    create: {
      userId: user.id,
      provider: "LOCAL",
      providerSubject: "local_sample_user",
      email: user.email,
    },
  });

  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  console.log("Seed complete");
  console.log(`  admin: ${admin.email} (${admin.id}) LOCAL:local_admin`);
  console.log(`  user:  ${user.email} (${user.id}) LOCAL:local_sample_user`);
  console.log(`  dog:   ${dog.name} (${dog.id})`);
  console.log(`  contest: ${contest.slug} ${contest.status}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
