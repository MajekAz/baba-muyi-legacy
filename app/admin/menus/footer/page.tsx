import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MenuManagementForm } from "@/components/admin/menu-management-form";
import { getAllMenuItems } from "@/lib/cms-store";

export default async function FooterMenuPage() {
  const items = await getAllMenuItems("footer");
  return (
    <main>
      <AdminPageHeader eyebrow="Menus" title="Footer Menu" description="Manage footer links and legal/navigation destinations." />
      <section className="p-4 sm:p-6 lg:p-8"><MenuManagementForm location="footer" items={items} /></section>
    </main>
  );
}
