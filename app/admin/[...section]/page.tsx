import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string[] }> }) {
  const { section } = await params;
  const title = section.map((part) => part.replaceAll("-", " ")).join(" / ");

  return (
    <main>
      <AdminPageHeader
        eyebrow="Admin module"
        title={title}
        description="This module route is reserved for the reusable CMS workflow. It will use the same role, revision, audit, privacy, and publishing controls as the primary admin sections."
      />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <p className="text-sm leading-6 text-slate-700">
            The route exists so admin navigation can be tested end to end while the detailed CRUD screen is implemented.
          </p>
        </div>
      </section>
    </main>
  );
}
