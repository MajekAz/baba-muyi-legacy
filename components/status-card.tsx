type StatusCardProps = {
  title: string;
  description: string;
  status?: string;
};

export function StatusCard({ title, description, status = "Planned content model ready" }: StatusCardProps) {
  return (
    <article className="rounded border border-archive-navy/12 bg-white/78 p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">{status}</p>
      <h3 className="mt-3 font-serif text-2xl font-semibold text-archive-navy">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
    </article>
  );
}
