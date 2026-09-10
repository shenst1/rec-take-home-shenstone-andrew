import { beforeEach, describe, expect, test } from "vitest";
import { prisma } from "../src/client";
import { listOpenSections } from "../src/list-open-sections";
import { registerChild } from "../src/register-child";
import { now, resetDb, seedChild, seedSection } from "./helpers";

describe("listOpenSections", () => {
  beforeEach(resetDb);

  test("includes sections that are open or have no release date", async () => {
    const { section: openSection } = await seedSection();
    const neverGated = await prisma.program.create({
      data: {
        name: "Open Studio",
        registrationOpensAt: null,
        sections: { create: { name: "Walk-in hours", capacity: 10 } },
      },
      include: { sections: true },
    });

    const listed = await listOpenSections({ now });
    const ids = listed.map((section) => section.id);

    expect(ids).toContain(openSection.id);
    expect(ids).toContain(neverGated.sections[0]!.id);
  });

  test("hides sections whose program has not opened yet", async () => {
    const { section: openSection } = await seedSection();
    const { section: closedSection } = await seedSection({
      opensAt: new Date("2026-10-01T08:00:00Z"),
    });

    const listed = await listOpenSections({ now });
    const ids = listed.map((section) => section.id);

    expect(ids).toContain(openSection.id);
    expect(ids).not.toContain(closedSection.id);
  });

  test("reports remaining seats and waitlist size", async () => {
    const { section } = await seedSection({ capacity: 1 });
    const seated = await seedChild();
    const waiting = await seedChild(new Date("2018-11-03"));

    await registerChild({ childId: seated.id, sectionId: section.id, now });
    await registerChild({ childId: waiting.id, sectionId: section.id, now });

    const [listed] = await listOpenSections({ now });

    expect(listed).toMatchObject({
      id: section.id,
      capacity: 1,
      registeredCount: 1,
      waitlistCount: 1,
      seatsRemaining: 0,
    });
    expect(listed?.registered).toEqual([]);
    expect(listed?.waitlisted).toEqual([]);
  });

  test("includes seated and waitlisted children when asked", async () => {
    const { section } = await seedSection({ capacity: 1 });
    const seated = await seedChild();
    const waiting = await seedChild(new Date("2018-11-03"));

    await registerChild({ childId: seated.id, sectionId: section.id, now });
    await registerChild({ childId: waiting.id, sectionId: section.id, now });

    const [listed] = await listOpenSections({ now, includeRoster: true });

    expect(listed?.registered).toEqual([
      {
        id: seated.id,
        firstName: seated.firstName,
        lastName: seated.lastName,
        householdName: "Chen household",
      },
    ]);
    expect(listed?.waitlisted).toEqual([
      {
        id: waiting.id,
        firstName: waiting.firstName,
        lastName: waiting.lastName,
        householdName: "Chen household",
      },
    ]);
  });

  test("orders by program name, then section name", async () => {
    await prisma.program.create({
      data: {
        name: "Yoga",
        registrationOpensAt: new Date("2026-09-01T08:00:00Z"),
        sections: { create: { name: "Evening", capacity: 8 } },
      },
    });
    await prisma.program.create({
      data: {
        name: "Art Camp",
        registrationOpensAt: new Date("2026-09-01T08:00:00Z"),
        sections: {
          create: [
            { name: "Week B", capacity: 8 },
            { name: "Week A", capacity: 8 },
          ],
        },
      },
    });

    const listed = await listOpenSections({ now });

    expect(listed.map((section) => `${section.program.name} / ${section.name}`)).toEqual([
      "Art Camp / Week A",
      "Art Camp / Week B",
      "Yoga / Evening",
    ]);
  });
});
