import { prisma } from "./client";

export type SectionChild = {
  id: number;
  firstName: string;
  lastName: string;
  householdName: string;
};

export type OpenSection = {
  id: number;
  name: string;
  capacity: number;
  minAge: number | null;
  maxAge: number | null;
  registeredCount: number;
  waitlistCount: number;
  seatsRemaining: number;
  registered: SectionChild[];
  waitlisted: SectionChild[];
  program: {
    id: number;
    name: string;
    description: string | null;
    registrationOpensAt: Date | null;
  };
};

export async function listOpenSections(input?: {
  now?: Date;
  includeRoster?: boolean;
}): Promise<OpenSection[]> {
  const now = input?.now ?? new Date();
  const includeRoster = input?.includeRoster ?? false;

  const sections = await prisma.section.findMany({
    where: {
      OR: [
        { program: { registrationOpensAt: null } },
        { program: { registrationOpensAt: { lte: now } } },
      ],
    },
    include: {
      program: true,
      _count: { select: { registrations: true, waitlist: true } },
      ...(includeRoster
        ? {
            registrations: {
              include: { child: { include: { household: true } } },
              orderBy: { createdAt: "asc" as const },
            },
            waitlist: {
              include: { child: { include: { household: true } } },
              orderBy: [{ createdAt: "asc" as const }, { id: "asc" as const }],
            },
          }
        : {}),
    },
    orderBy: [{ program: { name: "asc" } }, { name: "asc" }],
  });

  return sections.map((section) => ({
    id: section.id,
    name: section.name,
    capacity: section.capacity,
    minAge: section.minAge,
    maxAge: section.maxAge,
    registeredCount: section._count.registrations,
    waitlistCount: section._count.waitlist,
    seatsRemaining: Math.max(0, section.capacity - section._count.registrations),
    registered: includeRoster
      ? section.registrations.map((entry) => toSectionChild(entry.child))
      : [],
    waitlisted: includeRoster
      ? section.waitlist.map((entry) => toSectionChild(entry.child))
      : [],
    program: {
      id: section.program.id,
      name: section.program.name,
      description: section.program.description,
      registrationOpensAt: section.program.registrationOpensAt,
    },
  }));
}

function toSectionChild(child: {
  id: number;
  firstName: string;
  lastName: string;
  household: { name: string };
}): SectionChild {
  return {
    id: child.id,
    firstName: child.firstName,
    lastName: child.lastName,
    householdName: child.household.name,
  };
}
