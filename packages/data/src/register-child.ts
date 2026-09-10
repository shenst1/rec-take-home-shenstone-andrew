import type { Registration, WaitlistEntry } from "../generated/client";
import { prisma } from "./client";

export class RegistrationError extends Error {
  constructor(
    public readonly code:
      | "CHILD_NOT_FOUND"
      | "SECTION_NOT_FOUND"
      | "NOT_OPEN"
      | "AGE_RESTRICTED"
      | "ALREADY_ENROLLED",
    message: string,
  ) {
    super(message);
    this.name = "RegistrationError";
  }
}

export type RegisterChildResult =
  | { status: "registered"; registration: Registration }
  | { status: "waitlisted"; waitlistEntry: WaitlistEntry };

export async function registerChild(input: {
  childId: number;
  sectionId: number;
  now?: Date;
}): Promise<RegisterChildResult> {
  const now = input.now ?? new Date();

  return prisma.$transaction(async (tx) => {
    const child = await tx.child.findUnique({ where: { id: input.childId } });
    if (!child) {
      throw new RegistrationError("CHILD_NOT_FOUND", "Child not found");
    }

    const section = await tx.section.findUnique({
      where: { id: input.sectionId },
      include: {
        program: true,
        _count: { select: { registrations: true } },
      },
    });
    if (!section) {
      throw new RegistrationError("SECTION_NOT_FOUND", "Section not found");
    }

    const opensAt = section.program.registrationOpensAt;
    if (opensAt && opensAt > now) {
      throw new RegistrationError("NOT_OPEN", "Registration is not open yet");
    }

    const age = ageInYears(child.dateOfBirth, now);
    if (
      (section.minAge != null && age < section.minAge) ||
      (section.maxAge != null && age > section.maxAge)
    ) {
      throw new RegistrationError(
        "AGE_RESTRICTED",
        `Section is for ages ${section.minAge ?? "any"}–${section.maxAge ?? "any"}`,
      );
    }

    const alreadyRegistered = await tx.registration.findUnique({
      where: {
        sectionId_childId: { sectionId: section.id, childId: child.id },
      },
    });
    const alreadyWaitlisted = await tx.waitlistEntry.findUnique({
      where: {
        sectionId_childId: { sectionId: section.id, childId: child.id },
      },
    });
    if (alreadyRegistered || alreadyWaitlisted) {
      throw new RegistrationError(
        "ALREADY_ENROLLED",
        "Child is already registered or waitlisted for this section",
      );
    }

    if (section._count.registrations < section.capacity) {
      const registration = await tx.registration.create({
        data: { sectionId: section.id, childId: child.id },
      });
      return { status: "registered" as const, registration };
    }

    const waitlistEntry = await tx.waitlistEntry.create({
      data: { sectionId: section.id, childId: child.id },
    });
    return { status: "waitlisted" as const, waitlistEntry };
  });
}

export function ageInYears(dateOfBirth: Date, asOf: Date) {
  let age = asOf.getFullYear() - dateOfBirth.getFullYear();
  const monthDelta = asOf.getMonth() - dateOfBirth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && asOf.getDate() < dateOfBirth.getDate())) {
    age -= 1;
  }
  return age;
}
