import { prisma } from "../src/client";

export const now = new Date("2026-09-10T12:00:00Z");

export async function resetDb() {
  await prisma.waitlistEntry.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.child.deleteMany();
  await prisma.household.deleteMany();
  await prisma.section.deleteMany();
  await prisma.program.deleteMany();
}

export async function seedSection(overrides?: {
  capacity?: number;
  minAge?: number | null;
  maxAge?: number | null;
  opensAt?: Date | null;
}) {
  const program = await prisma.program.create({
    data: {
      name: "Swim Lessons",
      registrationOpensAt:
        overrides && "opensAt" in overrides ? overrides.opensAt : new Date("2026-09-01T08:00:00Z"),
      sections: {
        create: {
          name: "Tuesdays 4–5pm",
          capacity: overrides?.capacity ?? 1,
          minAge: overrides?.minAge ?? 6,
          maxAge: overrides?.maxAge ?? 8,
        },
      },
    },
    include: { sections: true },
  });

  return { program, section: program.sections[0]! };
}

export async function seedChild(dateOfBirth = new Date("2019-04-12")) {
  const household = await prisma.household.create({
    data: {
      email: `parent-${crypto.randomUUID()}@example.com`,
      name: "Chen household",
      children: {
        create: { firstName: "Avery", lastName: "Chen", dateOfBirth },
      },
    },
    include: { children: true },
  });

  return household.children[0]!;
}
