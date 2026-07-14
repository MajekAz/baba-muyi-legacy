"use client";

import { useActionState } from "react";
import { joinWaitingList } from "@/lib/actions";

const initialState = { ok: false, message: "" };

export function WaitingListForm() {
  const [state, formAction, pending] = useActionState(joinWaitingList, initialState);

  return (
    <form action={formAction} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="name">
          Name
        </label>
        <input className="rounded border border-slate-300 px-3 py-2" id="name" name="name" required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="email">
          Email
        </label>
        <input className="rounded border border-slate-300 px-3 py-2" id="email" name="email" required type="email" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="interest">
          Interest
        </label>
        <select className="rounded border border-slate-300 px-3 py-2" id="interest" name="interest" required>
          <option value="family">Family legacy page</option>
          <option value="community">Community archive</option>
          <option value="organisation">Organisation archive</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="note">
          Note
        </label>
        <textarea className="min-h-28 rounded border border-slate-300 px-3 py-2" id="note" name="note" />
      </div>
      <button className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" disabled={pending} type="submit">
        {pending ? "Joining..." : "Join waiting list"}
      </button>
      {state.message ? (
        <p className={state.ok ? "text-sm font-semibold text-green-700" : "text-sm font-semibold text-red-700"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
