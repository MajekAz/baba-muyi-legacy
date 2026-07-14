# TODO

## Foundation

- Apply all migrations through `supabase/migrations/0003_workspace_saas_foundation.sql` to a real Supabase project.
- Create first owner user in Supabase Auth.
- Insert owner membership for the `baba-muyi-family-archive` workspace and `baba-muyi` legacy profile.
- Replace hand-maintained `lib/database.types.ts` with generated Supabase TypeScript types after remote schema is available.
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

## Content

- Add approved files to `content-source/`.
- Run content inventory again after source files are supplied.
- Run `pnpm content:import -- --dry-run`.
- Import only approved content.

## Deployment

- Configure Hostinger Node.js Web App.
- Configure production Supabase Auth redirect URLs.
- Run production smoke tests after deployment.
