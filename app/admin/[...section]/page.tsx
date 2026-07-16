import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string[] }> }) {
  const { section } = await params;
  const title = section.map((part) => part.replaceAll("-", " ")).join(" / ");

  return (
    <main>
      <AdminPageHeader
        eyebrow="Planned admin module"
        title={title}
        description="This area is planned for a later milestone and is not enabled as an active workflow yet."
      />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <p className="text-sm leading-6 text-slate-700">
            Use the available dashboard, content, media, user access, and menu screens for current production work.
          </p>
        </div>
      </section>
    </main>
  );
}
