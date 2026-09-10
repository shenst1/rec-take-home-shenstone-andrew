import { prisma } from "./src/client";
import { registerChild } from "./src/register-child";

const now = new Date("2026-09-10T12:00:00Z");

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
      registrationOpensAt: new Date("2026-09-01T08:00:00Z"),
      sections: {
        create: [
          { name: "Level 2 — Tuesdays 4–5pm", capacity: 8, minAge: 6, maxAge: 8 },
          { name: "Level 2 — Thursdays 4–5pm", capacity: 8, minAge: 6, maxAge: 8 },
        ],
      },
    },
    include: { sections: true },
  });

  const clay = await prisma.program.create({
    data: {
      name: "Clay Studio",
      description: "Hand-building for beginners. One seat left fills fast.",
      registrationOpensAt: new Date("2026-09-01T08:00:00Z"),
      sections: {
        create: [{ name: "Saturday 10–11am", capacity: 1, minAge: 5, maxAge: 10 }],
      },
    },
    include: { sections: true },
  });

  const basketball = await prisma.program.create({
    data: {
      name: "Basketball Camp",
      description: "Weeklong skills camp at the rec center gym. Not open yet.",
      registrationOpensAt: new Date("2027-01-15T08:00:00Z"),
      sections: {
        create: [{ name: "Ages 9–12 — June session", capacity: 16, minAge: 9, maxAge: 12 }],
      },
    },
  });

  const chen = await prisma.household.create({
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

  const patel = await prisma.household.create({
    data: {
      email: "priya.patel@example.com",
      name: "Patel household",
      children: {
        create: [
          { firstName: "Ravi", lastName: "Patel", dateOfBirth: new Date("2017-06-01") },
          { firstName: "Leela", lastName: "Patel", dateOfBirth: new Date("2019-02-20") },
        ],
      },
    },
    include: { children: true },
  });

  const avery = chen.children.find((child) => child.firstName === "Avery")!;
  const ravi = patel.children.find((child) => child.firstName === "Ravi")!;
  const leela = patel.children.find((child) => child.firstName === "Leela")!;
  const tuesdaySwim = swim.sections.find((section) => section.name.includes("Tuesdays"))!;
  const claySaturday = clay.sections[0]!;

  await registerChild({ childId: avery.id, sectionId: tuesdaySwim.id, now });
  await registerChild({ childId: ravi.id, sectionId: claySaturday.id, now });
  await registerChild({ childId: leela.id, sectionId: claySaturday.id, now });

  console.log("Seeded programs:", swim.name, clay.name, basketball.name);
  console.log("Open catalog: swim (seats left) + clay (full, 1 waitlisted). Basketball stays closed.");
  console.log("Demo family:", chen.email, "— register Avery for Thursday swim from the web app.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
