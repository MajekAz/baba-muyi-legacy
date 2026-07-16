"use client";

import { useRef, useState } from "react";
import { useEffect } from "react";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  onConfirm?: () => void;
  pendingLabel?: string;
  value?: string;
};

export function ConfirmSubmitButton({
  children,
  title,
  description,
  confirmLabel = "Confirm",
  className,
  disabled = false,
  name = "confirmed",
  onConfirm,
  pendingLabel,
  value = "true"
}: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button className={className} disabled={disabled} onClick={() => setOpen(true)} ref={triggerRef} type="button">
        {children}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
          <div className="w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-xl" ref={dialogRef}>
            <h2 className="font-serif text-2xl text-archive-navy" id="confirm-dialog-title">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                autoFocus
                className="min-h-11 rounded border border-slate-300 px-4 text-sm font-semibold text-slate-700"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                type="button"
              >
                Cancel
              </button>
              <button className="min-h-11 rounded bg-red-700 px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={disabled} name={name} onClick={onConfirm} type="submit" value={value}>
                {disabled && pendingLabel ? pendingLabel : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
