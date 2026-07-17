"use client";

import { useActionState } from "react";
import { submitLegacyHubInterest } from "@/lib/actions";

const initialState = { ok: false, message: "" };

const archiveTypes = [
  ["family_legacy", "Family legacy"],
  ["community_history", "Community history"],
  ["cultural_heritage", "Cultural heritage"],
  ["institution_or_school", "Institution or school"],
  ["religious_organisation", "Religious organisation"],
  ["military_or_veterans_history", "Military or veterans' history"],
  ["business_or_founder_story", "Business or founder story"],
  ["museum_or_heritage_project", "Museum or heritage project"],
  ["other", "Other"]
] as const;

export function EarlyAccessForm() {
  const [state, formAction, pending] = useActionState(submitLegacyHubInterest, initialState);

  return (
    <form action={formAction} className="grid gap-5 rounded border border-stone-300/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-950" htmlFor="early-access-name">
          Name
        </label>
        <input className="min-h-11 rounded border border-stone-300 px-3 py-2 text-base text-slate-950" id="early-access-name" name="name" required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-950" htmlFor="early-access-email">
          Email
        </label>
        <input className="min-h-11 rounded border border-stone-300 px-3 py-2 text-base text-slate-950" id="early-access-email" name="email" required type="email" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-950" htmlFor="early-access-organisation">
          Organisation or family name
        </label>
        <input className="min-h-11 rounded border border-stone-300 px-3 py-2 text-base text-slate-950" id="early-access-organisation" name="organisation" required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-950" htmlFor="early-access-type">
          Type of archive
        </label>
        <select className="min-h-11 rounded border border-stone-300 px-3 py-2 text-base text-slate-950" id="early-access-type" name="archiveType" required>
          <option value="">Select an archive type</option>
          {archiveTypes.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-950" htmlFor="early-access-country">
          Country
        </label>
        <input className="min-h-11 rounded border border-stone-300 px-3 py-2 text-base text-slate-950" id="early-access-country" name="country" required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-950" htmlFor="early-access-description">
          Short description
        </label>
        <textarea
          aria-describedby="early-access-description-help"
          className="min-h-32 rounded border border-stone-300 px-3 py-2 text-base text-slate-950"
          id="early-access-description"
          name="description"
          required
        />
        <p className="text-xs leading-5 text-slate-600" id="early-access-description-help">
          Share the kind of legacy archive you would like to preserve. Please do not include passwords, private keys, or highly sensitive personal records.
        </p>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="legacyhub-website">Website</label>
        <input id="legacyhub-website" name="website" tabIndex={-1} />
      </div>
      <label className="flex gap-3 text-sm leading-6 text-slate-700" htmlFor="early-access-consent">
        <input className="mt-1 size-4 rounded border-stone-400" id="early-access-consent" name="consent" required type="checkbox" />
        <span>I consent to LegacyHub storing this enquiry for review and contacting me about early access. This does not create an account.</span>
      </label>
      <button
        className="min-h-12 rounded bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        aria-describedby="early-access-status"
        disabled={pending}
        type="submit"
      >
        {pending ? "Sending interest..." : "Join the early access list"}
      </button>
      <p
        aria-live="polite"
        className={state.message ? (state.ok ? "text-sm font-bold text-emerald-700" : "text-sm font-bold text-red-700") : "sr-only"}
        id="early-access-status"
      >
        {state.message || "Early-access form status will appear here."}
      </p>
      <p className="text-xs leading-5 text-slate-500">
        Early access is reviewed manually. Public registration, billing, and automatic workspace creation are not enabled.
      </p>
    </form>
  );
}
