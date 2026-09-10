"use server";

import { listOpenSections } from "@rec/data";

export async function getOpenSections() {
  return listOpenSections({ includeRoster: true });
}
