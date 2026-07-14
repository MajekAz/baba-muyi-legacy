# Local Setup

## Requirements

- Node.js 20 or newer
- pnpm
- Supabase project credentials when you are ready to test remote auth/database/storage

## Install

```bash
pnpm install
```

## Environment

Create `.env.local` from `.env.example`.

The public site can run without Supabase credentials during early foundation work. Admin authentication, database reads, storage, and RLS testing require real Supabase values.

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
```

Never put `SUPABASE_SERVICE_ROLE_KEY` in client components, browser code, or public hosting variables that are exposed to the browser.

## Development

```bash
pnpm dev
```

Open `http://localhost:3000`.

Admin routes use a local owner fallback when Supabase is not configured so the CMS foundation can be developed. This fallback is not production authentication and is clearly labelled in the admin workspace context bar.

Production admin access requires real Supabase credentials, applied migrations, and a manually created first owner.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## SaaS Local Fallback

`data/cms.json` contains local workspace-aware fallback data:

- Workspace: `Baba Muyi Family Archive`
- Legacy profile: `Baba Muyi`

Do not treat this file as production data. Supabase becomes the source of truth after credentials and migrations are configured.

## Content Import

Real content import is paused until approved source files exist.

```bash
pnpm content:import -- --dry-run
```

The dry run expects `content-source/approved-content.json`.
