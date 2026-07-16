# Product Decisions

## Brand Architecture

- LegacyHub is the commercial platform brand.
- Baba Muyi Legacy is the flagship archive, first workspace, and first legacy profile implementation.
- Public archive pages keep Baba Muyi Legacy as the primary wordmark.
- Admin, authentication, workspace management, and platform features use LegacyHub branding.

## Shell Separation

- Public and admin shells are separate.
- Public navigation and footer must never appear inside authenticated admin routes.
- Admin pages use the shared LegacyHub admin shell with workspace, legacy profile, role, sidebar navigation, breadcrumbs, and sign-out controls.

## Tenant Context

- Workspace and legacy-profile names must come from active tenant context.
- Baba Muyi names must not be hard-coded globally in admin components.
- Sidebar visibility is convenience only; server-side permission checks and Supabase RLS remain the authority.

## Admin Navigation

- Admin navigation is permission-aware.
- Unfinished modules must be omitted or clearly marked as planned/disabled.
- New admin modules must use the shared admin design system, including breadcrumbs, empty states, safe errors, and accessible destructive-action confirmation.

## Public Registration

- Public registration, billing, AI generation, marketplace features, family-tree functionality, and documentary management remain outside the current MVP.
