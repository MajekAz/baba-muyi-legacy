# Hostinger Deployment

Use Hostinger Node.js Web App hosting. Do not deploy this as a static HTML export.

## Commands

Build command:

```bash
pnpm install --frozen-lockfile && pnpm build
```

Start command:

```bash
pnpm start
```

## Environment Variables

Set these in Hostinger:

```bash
NEXT_PUBLIC_SITE_URL=https://babamuyilegacy.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
NEXT_PUBLIC_AUTH_REDIRECT_URL=https://babamuyilegacy.com/auth/callback
```

## Health Check

Use:

```text
https://babamuyilegacy.com/api/health
```

## Manual Deployment Steps

1. Push the repository to GitHub.
2. Create/configure the Hostinger Node.js app.
3. Point the app root to `baba-muyi-legacy`.
4. Set environment variables.
5. Run the build command.
6. Start the app.
7. Confirm `/api/health` returns JSON with `"ok": true`.
8. Configure DNS for `babamuyilegacy.com`.

## GitHub Deployment Flow

1. Push the repository to GitHub.
2. Connect Hostinger to the GitHub repository or deploy from the checked-out project.
3. Confirm Hostinger uses Node.js hosting for the `baba-muyi-legacy` app root.
4. Add the Supabase environment variables before building.
5. Run migrations on Supabase before testing protected admin flows.

## Security Notes

- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to client bundles.
- Keep Supabase Auth redirect URLs in sync with the final domain.
- Ensure production builds run after environment variables are set.
- Public signup remains disabled for first launch; create the owner manually in Supabase Auth.
