import { describe, expect, test } from "vitest";
import { prisma } from "../src/client";

describe("test database", () => {
  test("creates a program with a section", async () => {
    const program = await prisma.program.create({
      data: {
        name: "Swim Lessons",
        sections: {
          create: { name: "Tuesdays 4–5pm", capacity: 8, minAge: 6, maxAge: 8 },
        },
      },
      include: { sections: true },
    });

    expect(program.sections).toHaveLength(1);
    expect(program.sections[0]).toMatchObject({
      name: "Tuesdays 4–5pm",
      capacity: 8,
    });
  });

  test("rejects a second household with the same email", async () => {
    await prisma.household.create({
      data: { email: "maya.chen@example.com", name: "Chen household" },
    });

    await expect(
      prisma.household.create({
        data: { email: "maya.chen@example.com", name: "Duplicate" },
      }),
    ).rejects.toThrow();
  });
});
