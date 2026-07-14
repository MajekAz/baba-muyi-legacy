"use client";

import { useActionState } from "react";
import { submitTribute } from "@/lib/actions";

const initialState = { ok: false, message: "" };

export function TributeForm() {
  const [state, formAction, pending] = useActionState(submitTribute, initialState);

  return (
    <form action={formAction} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="authorName">
          Your name
        </label>
        <input className="rounded border border-slate-300 px-3 py-2" id="authorName" name="authorName" required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="authorEmail">
          Email address
        </label>
        <input className="rounded border border-slate-300 px-3 py-2" id="authorEmail" name="authorEmail" type="email" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="relationship">
          Relationship
        </label>
        <input className="rounded border border-slate-300 px-3 py-2" id="relationship" name="relationship" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="message">
          Memory or tribute
        </label>
        <textarea className="min-h-40 rounded border border-slate-300 px-3 py-2" id="message" name="message" required />
      </div>
      <label className="flex gap-3 text-sm text-slate-700">
        <input className="mt-1" name="consentToPublish" type="checkbox" required />
        <span>I consent to family review and publication of this tribute.</span>
      </label>
      <button
        className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-archive-charcoal disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Submitting..." : "Submit tribute"}
      </button>
      {state.message ? (
        <p className={state.ok ? "text-sm font-semibold text-green-700" : "text-sm font-semibold text-red-700"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
