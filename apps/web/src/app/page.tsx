import { getOpenSections } from "./actions";
import { RegisterAveryForm } from "./register-avery-form";

export const dynamic = "force-dynamic";

function ageRange(minAge: number | null, maxAge: number | null) {
  if (minAge == null && maxAge == null) return "Any age";
  if (minAge == null) return `Up to ${maxAge}`;
  if (maxAge == null) return `${minAge}+`;
  return `Ages ${minAge}–${maxAge}`;
}

export default async function Home() {
  const sections = await getOpenSections();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
        Families
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        Parks &amp; Rec
      </h1>
      <p className="mt-4 text-lg leading-7 text-stone-600">
        Open sections from the shared database. Register the seeded child Avery
        Chen to exercise the same <code>registerChild</code> action the tests use.
      </p>

      <ul className="mt-10 space-y-4">
        {sections.map((section) => (
          <li
            key={section.id}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">{section.program.name}</p>
            <h2 className="mt-1 text-xl font-semibold">{section.name}</h2>
            <p className="mt-2 text-sm text-stone-600">
              {ageRange(section.minAge, section.maxAge)} · {section.seatsRemaining} of{" "}
              {section.capacity} seats left
              {section.waitlistCount > 0 ? ` · ${section.waitlistCount} waitlisted` : ""}
            </p>
            {section.program.description ? (
              <p className="mt-2 text-sm leading-6 text-stone-500">
                {section.program.description}
              </p>
            ) : null}
            <RegisterAveryForm sectionId={section.id} />
          </li>
        ))}
      </ul>
    </main>
  );
}
