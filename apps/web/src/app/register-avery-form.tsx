"use client";

import { useActionState } from "react";
import { registerAvery, type RegisterAveryState } from "./actions";

export function RegisterAveryForm({ sectionId }: { sectionId: number }) {
  const [state, action, pending] = useActionState<RegisterAveryState, FormData>(
    registerAvery,
    null,
  );

  return (
    <form action={action} className="mt-4 flex flex-col items-start gap-2">
      <input type="hidden" name="sectionId" value={sectionId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Registering…" : "Register Avery"}
      </button>
      {state?.ok === true ? (
        <p className="text-sm text-emerald-700">
          {state.status === "registered" ? "Avery is registered." : "Avery is on the waitlist."}
        </p>
      ) : null}
      {state?.ok === false ? <p className="text-sm text-red-700">{state.message}</p> : null}
    </form>
  );
}
