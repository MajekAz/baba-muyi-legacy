import { publicNavigation } from "@/lib/navigation";
import { roles } from "@/lib/permissions";
import { saveCmsMenuItem } from "@/lib/cms-actions";
import type { CmsMenuItem } from "@/lib/cms-types";

const menuLocations = ["header", "mobile", "footer", "secondary", "admin"] as const;
const linkTypes = ["internal", "external", "documentary", "biography_section", "timeline_section", "album", "document_download"] as const;
const visibilityOptions = ["public", "registered", "invited", "specific_users", "password_protected", "private"] as const;
const statusOptions = ["draft", "scheduled", "published", "archived"] as const;

function isCmsMenuItem(item: CmsMenuItem | (typeof publicNavigation)[number]): item is CmsMenuItem {
  return "id" in item;
}

export function MenuManagementForm({ location = "header", items = [] }: { location?: string; items?: CmsMenuItem[] }) {
  const parentOptions = items.filter((item) => !item.parentId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
      <form action={saveCmsMenuItem} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-archive-navy" htmlFor="menuLocation">Menu location</label>
            <select className="rounded border border-slate-300 px-3 py-2" defaultValue={location} id="menuLocation" name="menuLocation">
              {menuLocations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-archive-navy" htmlFor="parentItem">Parent item</label>
            <select className="rounded border border-slate-300 px-3 py-2" id="parentItem" name="parentItem">
              <option value="">Top level</option>
              {(parentOptions.length ? parentOptions : publicNavigation).map((item) => <option key={item.label} value={isCmsMenuItem(item) ? item.id : item.label}>{item.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-archive-navy" htmlFor="label">Label</label>
            <input className="rounded border border-slate-300 px-3 py-2" id="label" name="label" placeholder="Menu label" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-archive-navy" htmlFor="slug">Slug</label>
            <input className="rounded border border-slate-300 px-3 py-2" id="slug" name="slug" placeholder="menu-label" />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor="url">URL</label>
          <input className="rounded border border-slate-300 px-3 py-2" id="url" name="url" placeholder="/internal-page or https://example.com" />
        </div>
        <div className="grid gap-2 md:grid-cols-4">
          <select className="rounded border border-slate-300 px-3 py-2" name="linkType" aria-label="Link type">
            {linkTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="rounded border border-slate-300 px-3 py-2" name="visibility" aria-label="Visibility">
            {visibilityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="rounded border border-slate-300 px-3 py-2" name="requiredRole" aria-label="Required role">
            <option value="">No role restriction</option>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <select className="rounded border border-slate-300 px-3 py-2" name="status" aria-label="Publication status">
            {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <input className="rounded border border-slate-300 px-3 py-2" min="0" name="sortOrder" placeholder="Sort order" type="number" />
          <input className="rounded border border-slate-300 px-3 py-2" name="icon" placeholder="Optional icon" />
          <input className="rounded border border-slate-300 px-3 py-2" name="badge" placeholder="Optional badge" />
        </div>
        <textarea className="min-h-24 rounded border border-slate-300 px-3 py-2" name="description" placeholder="Optional description" />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input name="openInNewTab" type="checkbox" />
          <span>Open in a new tab</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input name="hidden" type="checkbox" />
          <span>Hide item without deleting it</span>
        </label>
        <div className="flex flex-wrap gap-3">
          <button className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" type="submit">Save menu item</button>
        </div>
      </form>

      <div className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl text-archive-navy">CMS menu records</h2>
        <div className="mt-4 grid gap-2">
          {(items.length ? items.filter((item) => !item.parentId) : publicNavigation).map((item, index) => (
            <div className="rounded border border-slate-200 p-3" key={item.label}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-archive-navy">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.href}{isCmsMenuItem(item) ? ` · ${item.status}${item.hidden ? " · hidden" : ""}` : ""}</p>
                </div>
                <span className="rounded bg-archive-cream px-2 py-1 text-xs text-archive-brown">#{index + 1}</span>
              </div>
              {(isCmsMenuItem(item) ? items.filter((child) => child.parentId === item.id) : item.children)?.length ? (
                <div className="mt-2 grid gap-1 border-l border-slate-200 pl-3">
                  {(isCmsMenuItem(item) ? items.filter((child) => child.parentId === item.id) : item.children ?? []).map((child) => (
                    <p className="text-sm text-slate-600" key={child.href}>{child.label} · {child.href}</p>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
