import { beforeEach, describe, expect, test } from "vitest";
import { prisma } from "../src/client";
import { RegistrationError, registerChild } from "../src/register-child";

const now = new Date("2026-09-10T12:00:00Z");

async function seedSection(overrides?: {
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

  return program.sections[0]!;
}

async function seedChild(dateOfBirth = new Date("2019-04-12")) {
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

describe("registerChild", () => {
  beforeEach(async () => {
    await prisma.waitlistEntry.deleteMany();
    await prisma.registration.deleteMany();
    await prisma.child.deleteMany();
    await prisma.household.deleteMany();
    await prisma.section.deleteMany();
    await prisma.program.deleteMany();
  });

  test("registers when a seat is open", async () => {
    const section = await seedSection({ capacity: 2 });
    const child = await seedChild();

    const result = await registerChild({
      childId: child.id,
      sectionId: section.id,
      now,
    });

    expect(result.status).toBe("registered");
    expect(await prisma.registration.count()).toBe(1);
    expect(await prisma.waitlistEntry.count()).toBe(0);
  });

  test("waitlists when the section is full", async () => {
    const section = await seedSection({ capacity: 1 });
    const seated = await seedChild();
    const waiting = await seedChild(new Date("2018-11-03"));

    await registerChild({ childId: seated.id, sectionId: section.id, now });
    const result = await registerChild({
      childId: waiting.id,
      sectionId: section.id,
      now,
    });

    expect(result.status).toBe("waitlisted");
    expect(await prisma.registration.count()).toBe(1);
    expect(await prisma.waitlistEntry.count()).toBe(1);
  });

  test("rejects registration before the program opens", async () => {
    const section = await seedSection({
      opensAt: new Date("2026-10-01T08:00:00Z"),
    });
    const child = await seedChild();

    await expect(
      registerChild({ childId: child.id, sectionId: section.id, now }),
    ).rejects.toMatchObject({
      name: "RegistrationError",
      code: "NOT_OPEN",
    } satisfies Partial<RegistrationError>);
  });

  test("rejects a child outside the age range", async () => {
    const section = await seedSection();
    const tooYoung = await seedChild(new Date("2023-01-01"));

    await expect(
      registerChild({ childId: tooYoung.id, sectionId: section.id, now }),
    ).rejects.toMatchObject({ code: "AGE_RESTRICTED" });
  });

  test("rejects a child already in the section", async () => {
    const section = await seedSection({ capacity: 2 });
    const child = await seedChild();

    await registerChild({ childId: child.id, sectionId: section.id, now });

    await expect(
      registerChild({ childId: child.id, sectionId: section.id, now }),
    ).rejects.toMatchObject({ code: "ALREADY_ENROLLED" });
  });
});
