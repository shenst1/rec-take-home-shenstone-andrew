import type { SectionChild } from "@rec/data";
import { getOpenSections } from "./actions";

export const dynamic = "force-dynamic";

function ageRange(minAge: number | null, maxAge: number | null) {
  if (minAge == null && maxAge == null) return "Any age";
  if (minAge == null) return `Up to ${maxAge}`;
  if (maxAge == null) return `${minAge}+`;
  return `Ages ${minAge}–${maxAge}`;
}

function Roster({ title, people }: { title: string; people: SectionChild[] }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</h3>
      {people.length === 0 ? (
        <p className="mt-1 text-sm text-slate-500">None</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {people.map((child) => (
            <li key={child.id} className="text-sm text-slate-700">
              {child.firstName} {child.lastName}
              <span className="text-slate-500"> · {child.householdName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function Home() {
  const sections = await getOpenSections();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
        City staff
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        Parks &amp; Rec Admin
      </h1>
      <p className="mt-4 text-lg leading-7 text-slate-600">
        Open sections and who is in them. Closed programs stay off this list
        until <code>registrationOpensAt</code>.
      </p>

      <ul className="mt-10 space-y-4">
        {sections.map((section) => (
          <li
            key={section.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{section.program.name}</p>
            <h2 className="mt-1 text-xl font-semibold">{section.name}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {ageRange(section.minAge, section.maxAge)} · {section.registeredCount}{" "}
              registered · {section.seatsRemaining} seats left
              {section.waitlistCount > 0 ? ` · ${section.waitlistCount} waitlisted` : ""}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Roster title="Registered" people={section.registered} />
              <Roster title="Waitlist" people={section.waitlisted} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
