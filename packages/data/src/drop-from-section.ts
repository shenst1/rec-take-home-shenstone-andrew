import type { Registration } from "../generated/client";
import { prisma } from "./client";
import { RegistrationError } from "./register-child";

export type DropFromSectionResult = {
  status: "dropped";
  promoted: Registration | null;
};

export async function dropFromSection(input: {
  childId: number;
  sectionId: number;
}): Promise<DropFromSectionResult> {
  return prisma.$transaction(async (tx) => {
    const registration = await tx.registration.findUnique({
      where: {
        sectionId_childId: {
          sectionId: input.sectionId,
          childId: input.childId,
        },
      },
    });

    if (registration) {
      await tx.registration.delete({ where: { id: registration.id } });

      const next = await tx.waitlistEntry.findFirst({
        where: { sectionId: input.sectionId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      });
      if (!next) {
        return { status: "dropped" as const, promoted: null };
      }

      await tx.waitlistEntry.delete({ where: { id: next.id } });
      const promoted = await tx.registration.create({
        data: { sectionId: input.sectionId, childId: next.childId },
      });
      return { status: "dropped" as const, promoted };
    }

    const waitlistEntry = await tx.waitlistEntry.findUnique({
      where: {
        sectionId_childId: {
          sectionId: input.sectionId,
          childId: input.childId,
        },
      },
    });
    if (waitlistEntry) {
      await tx.waitlistEntry.delete({ where: { id: waitlistEntry.id } });
      return { status: "dropped" as const, promoted: null };
    }

    throw new RegistrationError(
      "NOT_ENROLLED",
      "Child is not registered or waitlisted for this section",
    );
  });
}
