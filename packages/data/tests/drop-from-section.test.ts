import { beforeEach, describe, expect, test } from "vitest";
import { prisma } from "../src/client";
import { dropFromSection } from "../src/drop-from-section";
import { registerChild } from "../src/register-child";
import { now, resetDb, seedChild, seedSection } from "./helpers";

describe("dropFromSection", () => {
  beforeEach(resetDb);

  test("drops a seated child when the waitlist is empty", async () => {
    const { section } = await seedSection({ capacity: 1 });
    const child = await seedChild();
    await registerChild({ childId: child.id, sectionId: section.id, now });

    const result = await dropFromSection({
      childId: child.id,
      sectionId: section.id,
    });

    expect(result.promoted).toBeNull();
    expect(await prisma.registration.count()).toBe(0);
    expect(await prisma.waitlistEntry.count()).toBe(0);
  });

  test("promotes the first waitlisted child when a seat opens", async () => {
    const { section } = await seedSection({ capacity: 1 });
    const seated = await seedChild();
    const firstWait = await seedChild(new Date("2018-11-03"));
    const secondWait = await seedChild(new Date("2019-01-20"));

    await registerChild({ childId: seated.id, sectionId: section.id, now });
    await registerChild({ childId: firstWait.id, sectionId: section.id, now });
    await registerChild({ childId: secondWait.id, sectionId: section.id, now });

    const result = await dropFromSection({
      childId: seated.id,
      sectionId: section.id,
    });

    expect(result.promoted?.childId).toBe(firstWait.id);
    expect(await prisma.registration.count()).toBe(1);
    expect(
      await prisma.registration.findUnique({
        where: {
          sectionId_childId: { sectionId: section.id, childId: firstWait.id },
        },
      }),
    ).not.toBeNull();
    expect(await prisma.waitlistEntry.count()).toBe(1);
    expect(
      await prisma.waitlistEntry.findUnique({
        where: {
          sectionId_childId: { sectionId: section.id, childId: secondWait.id },
        },
      }),
    ).not.toBeNull();
  });

  test("drops a waitlisted child without promoting anyone", async () => {
    const { section } = await seedSection({ capacity: 1 });
    const seated = await seedChild();
    const waiting = await seedChild(new Date("2018-11-03"));

    await registerChild({ childId: seated.id, sectionId: section.id, now });
    await registerChild({ childId: waiting.id, sectionId: section.id, now });

    const result = await dropFromSection({
      childId: waiting.id,
      sectionId: section.id,
    });

    expect(result.promoted).toBeNull();
    expect(
      await prisma.registration.findUnique({
        where: {
          sectionId_childId: { sectionId: section.id, childId: seated.id },
        },
      }),
    ).not.toBeNull();
    expect(await prisma.waitlistEntry.count()).toBe(0);
  });

  test("rejects a child who is not in the section", async () => {
    const { section } = await seedSection();
    const child = await seedChild();

    await expect(
      dropFromSection({ childId: child.id, sectionId: section.id }),
    ).rejects.toMatchObject({ code: "NOT_ENROLLED" });
  });
});
