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
| Admin dashboard | LegacyHub, with active workspace/profile context | Display the current workspace and active legacy profile from tenant context. |
| Authentication screens | LegacyHub | Use the tagline “Preserving Legacies. Connecting Generations.” and avoid Baba Muyi-only account language. |
| Documentation | LegacyHub for platform; Baba Muyi Legacy for flagship archive | Current planning docs follow this rule. |
| Emails | LegacyHub for platform/system emails; Baba Muyi Legacy for archive invitations when context-specific | Needs future templates. |
| Footer | Baba Muyi Legacy primary, with “Powered by LegacyHub” | LegacyHub relationship is present but less prominent than the archive brand. |
| Metadata | Baba Muyi Legacy for public archive SEO; LegacyHub for admin/auth/future platform pages | Do not replace public Baba Muyi titles indiscriminately. |
| Future customer sites | Customer/archive brand name, powered by LegacyHub where appropriate | Custom domains later. |
| Platform marketing website | LegacyHub | `/legacyhub` is the Phase 2 noindex platform landing page until public launch approval or a separate marketing domain is approved. |

## Taglines And Relationship Copy

- LegacyHub tagline: **Preserving Legacies. Connecting Generations.**
- Public flagship relationship copy: **Powered by LegacyHub** or **A LegacyHub Digital Archive**.
- Baba Muyi Legacy remains the public archive name and should be visually dominant on the public archive.
- LegacyHub is the commercial digital legacy platform behind the archive, not a replacement name for the Baba Muyi site.
- The public header uses grouped data-driven navigation and the subtitle **A LegacyHub Digital Archive**.

## Brand Token Boundaries

- Platform brand tokens live in `lib/brand.ts` as `platformBrand`.
- Workspace brand tokens live in `lib/brand.ts` as `workspaceBrandTokens`.
- Legacy-profile theme token defaults live in `lib/brand.ts` as `legacyProfileThemeTokens`.
- The current Baba Muyi public archive keeps the existing navy, gold, and cream visual identity.
- Future customer workspaces should read their own workspace and legacy-profile theme settings instead of reusing Baba Muyi-specific copy or visuals globally.

## Current Baba Muyi-Specific Code

- `lib/site.ts` contains Baba Muyi public site metadata with a subtle LegacyHub relationship.
- `lib/brand.ts` contains reusable platform, workspace, and legacy-profile brand tokens.
- `lib/cms-seed.ts` and `data/cms.json` contain Baba Muyi seed content.
- `app/layout.tsx`, `components/mobile-navigation.tsx`, and public copy show Baba Muyi Legacy branding.
- `app/admin/layout.tsx`, `components/admin/workspace-context-bar.tsx`, and auth routes use LegacyHub branding.
- `app/(platform)/legacyhub/page.tsx` is the noindex Phase 2 platform landing page with separate LegacyHub navigation and footer.
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
