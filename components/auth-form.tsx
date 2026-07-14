"use client";

import { useActionState } from "react";
import { signInWithPassword, requestPasswordReset, updatePassword } from "@/lib/auth-actions";

const initialState = { ok: false, message: "" };

type AuthFormProps = {
  mode: "login" | "reset" | "update";
};

export function AuthForm({ mode }: AuthFormProps) {
  const action =
    mode === "login" ? signInWithPassword : mode === "reset" ? requestPasswordReset : updatePassword;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      {mode !== "update" ? (
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor="email">
            Email address
          </label>
          <input className="rounded border border-slate-300 px-3 py-2" id="email" name="email" required type="email" />
        </div>
      ) : null}
      {mode !== "reset" ? (
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor="password">
            Password
          </label>
          <input
            className="rounded border border-slate-300 px-3 py-2"
            id="password"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </div>
      ) : null}
      <button className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" disabled={pending} type="submit">
        {pending ? "Working..." : mode === "login" ? "Sign in" : mode === "reset" ? "Send reset link" : "Update password"}
      </button>
      {state.message ? (
        <p className={state.ok ? "text-sm font-semibold text-green-700" : "text-sm font-semibold text-red-700"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
