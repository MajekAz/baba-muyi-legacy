"use client";

import { useRef, useState } from "react";
import { contactTypeLabels, contactSubmissionTypes } from "@/lib/contact/types";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string[]>;
};

const initialState: FormState = {
  status: "idle",
  message: "",
  fieldErrors: {}
};

function fieldError(errors: Record<string, string[]>, name: string) {
  return errors[name]?.[0] ?? null;
}

export function ArchiveContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ ...initialState, status: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: {
          Accept: "application/json"
        }
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: Record<string, string[]>;
      };

      if (!response.ok || !result.ok) {
        setState({
          status: "error",
          message: result.message ?? "Your message could not be sent. Please try again.",
          fieldErrors: result.fieldErrors ?? {}
        });
        return;
      }

      formRef.current?.reset();
      setState({
        status: "success",
        message: result.message ?? "Thank you. Your message has been received by the archive team.",
        fieldErrors: {}
      });
    } catch {
      setState({
        status: "error",
        message: "Your message could not be sent. Please check your connection and try again.",
        fieldErrors: {}
      });
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm sm:p-8" noValidate>
      <div className="sr-only" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-archive-navy">
          Your name
          <input
            aria-describedby={fieldError(state.fieldErrors, "senderName") ? "senderName-error" : undefined}
            aria-invalid={Boolean(fieldError(state.fieldErrors, "senderName"))}
            className="min-h-11 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900"
            name="senderName"
            required
            type="text"
          />
          {fieldError(state.fieldErrors, "senderName") ? <span id="senderName-error" className="text-xs font-semibold text-red-700">{fieldError(state.fieldErrors, "senderName")}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-archive-navy">
          Email address
          <input
            aria-describedby={fieldError(state.fieldErrors, "senderEmail") ? "senderEmail-error" : undefined}
            aria-invalid={Boolean(fieldError(state.fieldErrors, "senderEmail"))}
            className="min-h-11 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900"
            name="senderEmail"
            required
            type="email"
          />
          {fieldError(state.fieldErrors, "senderEmail") ? <span id="senderEmail-error" className="text-xs font-semibold text-red-700">{fieldError(state.fieldErrors, "senderEmail")}</span> : null}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-archive-navy">
        Relationship to the archive
        <input
          className="min-h-11 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900"
          maxLength={160}
          name="relationship"
          placeholder="Family member, friend, community member, researcher..."
          type="text"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-archive-navy">
        What would you like to send?
        <select className="min-h-11 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="submissionType" required>
          {contactSubmissionTypes.map((type) => (
            <option key={type} value={type}>{contactTypeLabels[type]}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold text-archive-navy">
        Message
        <textarea
          aria-describedby={fieldError(state.fieldErrors, "message") ? "message-error" : "message-help"}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "message"))}
          className="min-h-40 rounded border border-slate-300 px-3 py-2 font-normal leading-6 text-slate-900"
          name="message"
          required
        />
        <span id="message-help" className="text-xs font-normal leading-5 text-slate-600">Please include enough context for the archive team to review and follow up respectfully.</span>
        {fieldError(state.fieldErrors, "message") ? <span id="message-error" className="text-xs font-semibold text-red-700">{fieldError(state.fieldErrors, "message")}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-semibold text-archive-navy">
        Optional attachment
        <input
          accept=".jpg,.jpeg,.png,.webp,.pdf,.mp3,.mp4,image/jpeg,image/png,image/webp,application/pdf,audio/mpeg,video/mp4"
          className="rounded border border-dashed border-slate-300 px-3 py-3 text-sm font-normal text-slate-700 file:mr-4 file:rounded file:border-0 file:bg-archive-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-archive-navy"
          name="attachment"
          type="file"
        />
        <span className="text-xs font-normal leading-5 text-slate-600">Accepted files: JPG, PNG, WebP, PDF, MP3, or MP4. Maximum file size: 25MB.</span>
      </label>

      <label className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700">
        <input
          aria-describedby={fieldError(state.fieldErrors, "consentToContact") ? "consentToContact-error" : undefined}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "consentToContact"))}
          className="mt-1 size-4 rounded border-slate-300 text-archive-gold"
          name="consentToContact"
          required
          type="checkbox"
        />
        <span>I consent to the archive team contacting me about this submission. I understand that submitted material will be reviewed before any public use.</span>
      </label>
      {fieldError(state.fieldErrors, "consentToContact") ? <span id="consentToContact-error" className="text-xs font-semibold text-red-700">{fieldError(state.fieldErrors, "consentToContact")}</span> : null}

      {state.message ? (
        <p
          className={[
            "rounded border px-4 py-3 text-sm font-semibold",
            state.status === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}

      <button
        className="min-h-12 rounded bg-archive-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-archive-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={state.status === "submitting"}
        type="submit"
      >
        {state.status === "submitting" ? "Sending..." : "Send to archive team"}
      </button>
    </form>
  );
}
