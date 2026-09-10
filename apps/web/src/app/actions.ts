"use server";

import {
  listOpenSections,
  prisma,
  registerChild,
  RegistrationError,
} from "@rec/data";
import { revalidatePath } from "next/cache";

export async function getOpenSections() {
  return listOpenSections();
}

export type RegisterAveryState =
  | { ok: true; status: "registered" | "waitlisted" }
  | { ok: false; message: string }
  | null;

export async function registerAvery(
  _prev: RegisterAveryState,
  formData: FormData,
): Promise<RegisterAveryState> {
  const sectionId = Number(formData.get("sectionId"));
  if (!Number.isInteger(sectionId) || sectionId < 1) {
    return { ok: false, message: "Missing section." };
  }

  const household = await prisma.household.findUnique({
    where: { email: "maya.chen@example.com" },
    include: { children: true },
  });
  const avery = household?.children.find((child) => child.firstName === "Avery");
  if (!avery) {
    return { ok: false, message: "Seeded child Avery Chen was not found. Run pnpm seed." };
  }

  try {
    const result = await registerChild({ childId: avery.id, sectionId });
    revalidatePath("/");
    return { ok: true, status: result.status };
  } catch (error) {
    if (error instanceof RegistrationError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
}
