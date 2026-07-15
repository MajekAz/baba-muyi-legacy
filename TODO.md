# TODO

## Foundation

- Maintain the LegacyHub terminology and roadmap documents for milestone sequencing.
- Keep generated `lib/database.types.ts` current after every remote schema migration.
- Add formal remote RLS regression tests before production launch.
- Replace admin dashboard placeholders with editable CRUD screens.
- Add rate limiting for public forms.
- Add upload validation endpoints and signed URL helpers.
- Connect the media uploader to Supabase signed upload URLs.
- Add server actions that combine media metadata writes with the storage helper functions.
- Connect invitation records to an email delivery provider.
- Add real CRUD actions for menus, documentaries, content records, access grants, and media metadata.
- Wire admin menu form controls to Supabase `menus` and `menu_items` CRUD actions.
- Add drag-and-drop persistence for menu item reordering.
- Add route-level smoke tests with a formal test runner.

## Milestone 2 Deferred Items

- Add rate limiting for CMS mutations in Milestone 3 Security Hardening.
- Add the full content revision-history browser in Milestone 3 or Milestone 4, after revision capture is stable.
- Add complete category management in Milestone 4 Content Organisation.
- Add complete tag management in Milestone 4 Content Organisation.

## Content

- Add approved files to `content-source/`.
- Run content inventory again after source files are supplied.
- Run `pnpm content:import -- --dry-run`.
- Import only approved content.

## Deployment

- Complete Hostinger production deployment from the v0.1.0 GitHub release tag.
- Configure production Supabase Auth redirect URLs for the final domain.
- Run production smoke tests after deployment.
