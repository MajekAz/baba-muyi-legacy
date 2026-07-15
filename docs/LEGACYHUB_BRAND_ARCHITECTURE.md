# LegacyHub Brand Architecture

## Brand Roles

### LegacyHub

- Commercial product and software platform.
- Admin and customer portal.
- SaaS documentation and roadmap.
- Future platform marketing identity.
- Future plan, billing, onboarding, and support identity.

### Baba Muyi Legacy

- First workspace and flagship public archive.
- Public visual identity for the Baba Muyi family archive.
- Case study and demonstration of the LegacyHub model.
- Should remain distinct where family archive tone matters.

## Where Each Name Should Appear

| Surface | Name to use | Notes |
| --- | --- | --- |
| Public Baba Muyi archive | Baba Muyi Legacy | Keep accepted public identity. |
| Public homepage/nav | Baba Muyi Legacy | Do not redesign or rename during this milestone. |
| Admin dashboard | LegacyHub admin, with active workspace/profile context | Gradual terminology shift is acceptable later. |
| Documentation | LegacyHub for platform; Baba Muyi Legacy for flagship archive | Current planning docs follow this rule. |
| Emails | LegacyHub for platform/system emails; Baba Muyi Legacy for archive invitations when context-specific | Needs future templates. |
| Footer | Baba Muyi Legacy on flagship site; LegacyHub on future product site | Do not change now. |
| Metadata | Baba Muyi Legacy for public archive SEO; LegacyHub for SaaS product pages | `lib/site.ts` remains Baba Muyi-specific today. |
| Future customer sites | Customer/archive brand name, powered by LegacyHub where appropriate | Custom domains later. |
| Platform marketing website | LegacyHub | Separate future marketing surface. |

## Current Baba Muyi-Specific Code

- `lib/site.ts` contains Baba Muyi public site metadata.
- `lib/cms-seed.ts` and `data/cms.json` contain Baba Muyi seed content.
- `app/layout.tsx`, `components/mobile-navigation.tsx`, and public copy show Baba Muyi Legacy branding.
- `DEPLOYMENT_HOSTINGER.md` references `babamuyilegacy.com`.

These are acceptable for the flagship public archive. They should not be globally reused for future customer workspaces.

## Repository Naming Recommendation

Keep the repository name `baba-muyi-legacy` through the Baba Muyi flagship launch and first Hostinger deployment. Rename to `legacyhub` only after:

1. The full app is pushed to GitHub.
2. Hostinger production deployment is stable.
3. Supabase production environment is verified.
4. Documentation and remote Git URLs are updated.
5. A redirect/rename plan is prepared for collaborators and deployment services.

Future rename process:

1. Pause deployments.
2. Rename repository in GitHub.
3. Update local remote URL.
4. Update Hostinger repository connection.
5. Update docs and CI settings.
6. Run a production redeploy.
7. Verify GitHub redirects and Hostinger deployment history.
