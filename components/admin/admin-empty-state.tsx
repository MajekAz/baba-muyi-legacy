import Link from "next/link";

type AdminEmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function AdminEmptyState({ title, description, actionHref, actionLabel }: AdminEmptyStateProps) {
  return (
    <div className="rounded border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="font-serif text-2xl text-archive-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      {actionHref && actionLabel ? (
        <Link className="mt-5 inline-flex min-h-11 items-center rounded bg-archive-navy px-4 text-sm font-semibold text-white hover:bg-archive-charcoal" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
