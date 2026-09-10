import { prisma } from "./src/client";

async function main() {
  await prisma.waitlistEntry.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.child.deleteMany();
  await prisma.household.deleteMany();
  await prisma.section.deleteMany();
  await prisma.program.deleteMany();

  const swim = await prisma.program.create({
    data: {
      name: "Swim Lessons",
      description: "Group lessons by level. Goggles recommended.",
      registrationOpensAt: new Date("2026-09-01T08:00:00"),
      sections: {
        create: [
          { name: "Level 2 — Tuesdays 4–5pm", capacity: 8, minAge: 6, maxAge: 8 },
          { name: "Level 2 — Thursdays 4–5pm", capacity: 8, minAge: 6, maxAge: 8 },
        ],
      },
    },
    include: { sections: true },
  });

  const basketball = await prisma.program.create({
    data: {
      name: "Basketball Camp",
      description: "Weeklong skills camp at the rec center gym.",
      registrationOpensAt: new Date("2026-09-15T08:00:00"),
      sections: {
        create: [{ name: "Ages 9–12 — June session", capacity: 16, minAge: 9, maxAge: 12 }],
      },
    },
    include: { sections: true },
  });

  const household = await prisma.household.create({
    data: {
      email: "maya.chen@example.com",
      name: "Chen household",
      children: {
        create: [
          { firstName: "Avery", lastName: "Chen", dateOfBirth: new Date("2018-04-12") },
          { firstName: "Milo", lastName: "Chen", dateOfBirth: new Date("2016-11-03") },
        ],
      },
    },
    include: { children: true },
  });

  const avery = household.children.find((child) => child.firstName === "Avery");
  const tuesdaySwim = swim.sections.find((section) => section.name.includes("Tuesdays"));

  if (avery && tuesdaySwim) {
    await prisma.registration.create({
      data: {
        childId: avery.id,
        sectionId: tuesdaySwim.id,
      },
    });
  }

  console.log("Seeded programs:", swim.name, basketball.name);
  console.log("Seeded household:", household.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
