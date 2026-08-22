"use client";

import { useState, type FormEvent } from "react";

const initialState = { ok: false, message: "" };

type AuthFormProps = {
  mode: "login" | "reset" | "update";
};

const authEndpoints = {
  login: "/api/auth/login",
  reset: "/api/auth/reset-password",
  update: "/api/auth/update-password"
} as const;

export function AuthForm({ mode }: AuthFormProps) {
  const [state, setState] = useState(initialState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setState(initialState);

    try {
      const response = await fetch(authEndpoints[mode], {
        method: "POST",
        body: new FormData(event.currentTarget),
        cache: "no-store"
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; redirectTo?: string };

      if (result.redirectTo && result.ok) {
        window.location.assign(result.redirectTo);
        return;
      }

      setState({
        ok: Boolean(result.ok),
        message: result.message ?? "Authentication request failed. Try again."
      });
    } catch {
      setState({ ok: false, message: "Authentication request failed. Try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      {mode !== "update" ? (
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor="email">
            Email address
          </label>
          <input className="rounded border border-slate-300 px-3 py-2" id="email" name="email" required type="email" />
        </div>
      ) : null}
      {mode !== "reset" ? (
        <>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-archive-navy" htmlFor="password">
              {mode === "update" ? "New password" : "Password"}
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
          {mode === "update" ? (
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-archive-navy" htmlFor="confirmPassword">
                Confirm new password
              </label>
              <input
                className="rounded border border-slate-300 px-3 py-2"
                id="confirmPassword"
                minLength={8}
                name="confirmPassword"
                required
                type="password"
              />
            </div>
          ) : null}
        </>
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
