# Admin UX Guide

## Navigation Structure

The LegacyHub admin shell contains a sticky header, permission-aware sidebar, breadcrumbs, and account controls. Public Baba Muyi archive navigation is not rendered on admin routes.

Sidebar sections:

- Dashboard
- Legacy Profiles, marked planned until enabled
- Content: Biography, Timeline, Stories, Lessons, Blog Posts
- Media Library: All Media, Upload, Images, Video, Audio, Documents, Albums
- Documentaries, marked planned until enabled
- Family, Contributions, Settings, and Audit Activity, marked planned until enabled
- Users and Access
- Menus

## Header Structure

The admin header shows:

- LegacyHub wordmark
- Administration label
- Active workspace
- Active legacy profile
- View public archive link
- User display name
- Role
- Sign-out control

Workspace and profile labels must come from tenant context, not global constants.

## Breadcrumb Rules

- Use a `nav` landmark with `aria-label="Admin breadcrumbs"`.
- The current page uses `aria-current="page"`.
- Labels should be derived from route configuration or safe route segments.
- Long labels must truncate on smaller screens.

## Form Conventions

- Every field needs a visible label.
- Required and optional fields should be clear.
- Validation summaries must not replace field-level errors.
- Submit buttons use pending text and disable duplicate submissions.
- Form actions must not expose database errors, stack traces, or secrets.
- Workflow status remains controlled by the existing status field and server-side permission checks.

## Toast Conventions

- Toasts use an accessible live region.
- Messages are short, user-facing, dismissible, and never include secret values or stack traces.
- Critical form errors remain visible inside the form and are not hidden by toasts.

## Empty-State Conventions

Each empty state should include:

- A clear title
- A short explanation
- A relevant action when the user is authorised

Avoid developer-facing language and avoid inventing historical facts.

## Destructive-Action Rules

- Archive actions require confirmation.
- Removing a media relationship requires confirmation.
- Cancel is the safe default.
- Dialogs must support Escape, visible focus, and focus return.
- Permanent deletion is not introduced where the product currently uses archive workflows.

## Responsive Patterns

- Sidebar collapses on desktop and becomes a drawer on mobile.
- Header content wraps rather than overlapping.
- Lists and cards must avoid horizontal overflow at narrow widths.
- Touch targets should be approximately 44px where practical.

## Accessibility Expectations

- Use semantic landmarks.
- Preserve heading hierarchy.
- Maintain visible focus states.
- Use status announcements for feedback.
- Do not communicate status by colour alone.
- Respect reduced-motion preferences.
