type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  inverse?: boolean;
};

export function SectionHeading({ eyebrow, title, children, inverse = false }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className={`text-sm font-bold uppercase tracking-[0.18em] ${inverse ? "text-archive-gold" : "text-archive-brown"}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl ${inverse ? "text-white" : "text-archive-navy"}`}>
        {title}
      </h2>
      {children ? (
        <div className={`mt-4 text-base leading-7 ${inverse ? "text-white/74" : "text-slate-700"}`}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
