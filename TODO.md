# TODO

## Foundation

- Apply and verify `0011_media_library_foundation.sql` against the remote Supabase project before production media use.
- Complete manual browser acceptance testing for media uploads with real images, PDFs, audio, and short video clips.
- Maintain the LegacyHub terminology and roadmap documents for milestone sequencing.
- Replace the noindex `/legacyhub` route shell with a dedicated platform marketing site only after registration, pricing, billing and onboarding are approved.
- Add editable workspace and legacy-profile theme settings that consume the reusable brand token boundaries.
- Replace interim navigation mappings for `Audio` and `About the Legacy Project` when dedicated public routes are approved.
- Keep generated `lib/database.types.ts` current after every remote schema migration.
- Add formal remote RLS regression tests before production launch.
- Replace admin dashboard placeholders with editable CRUD screens.
- Add rate limiting for public forms.
- Add upload rate limiting and malware scanning before public production upload intake.
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
