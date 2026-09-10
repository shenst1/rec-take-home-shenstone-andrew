export { prisma } from "./client";
export { Prisma, PrismaClient } from "../generated/client";
export {
  RegistrationError,
  ageInYears,
  registerChild,
} from "./register-child";
export type { RegisterChildResult } from "./register-child";
export type {
  Child,
  Household,
  Program,
  Registration,
  Section,
  WaitlistEntry,
} from "../generated/client";

