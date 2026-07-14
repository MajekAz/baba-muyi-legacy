import { SectionHeading } from "@/components/section-heading";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <main>
      <section className="bg-archive-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={eyebrow} title={title} inverse>
            <p>{description}</p>
          </SectionHeading>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">{children}</section>
    </main>
  );
}
