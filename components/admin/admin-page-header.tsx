type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminPageHeader({ eyebrow, title, description }: AdminPageHeaderProps) {
  return (
    <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-archive-brown">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-archive-navy">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{description}</p>
    </section>
  );
}
