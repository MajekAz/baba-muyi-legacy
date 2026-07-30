# Biography Editorial Pack v1.0 Release Notes

## Release

`BIOGRAPHY_EDITORIAL_PACK_v1.0`

## Summary

The official Baba Muyi Biography has been integrated into the LegacyHub Digital Museum using the existing CMS public rendering architecture.

## Included

- Approved long-form biography
- Biography-specific SEO metadata
- Minimal verified-safe JSON-LD
- Workspace and legacy-profile scoping
- Typed content fallback
- Editorial attribution
- Source and verification notes
- Related archive links
- Responsive public rendering

## Not Included

- Approved featured portrait
- Open Graph image
- Structured citations
- Footnotes
- Quick facts
- Pull quotes
- Chapter navigation
- Multiple inline media records
- Advanced source records
- Yoruba biography edition
- Evidence attachments
- Disputed-claim workflow

## Release References

- PR number: #12
- Source commit: `ef38f1804ffcb2a54531c2a614cb735d036a522a`
- Merge commit: `44c6e433a2526b705269013f15e64997d115a15a`
- Deployment identifier: Pending Hostinger deployment verification
- Production URL: `https://babamuyilegacy.com/biography`
- Release date: 2026-07-30

## Deployment Status

PR #12 was merged into `main` with a squash merge. Production deployment could not be verified during this release task because `babamuyilegacy.com` did not resolve through DNS from the validation environment, and the reachable Hostinger preview URL had not yet served the merged Biography v1.0 content.

The documented deployment method remains Hostinger Node.js hosting from `main`.

## Validation Summary

- `pnpm install --frozen-lockfile`: passed
- `pnpm lint`: passed
- `pnpm typecheck`: passed
- `pnpm build`: passed
- `pnpm test`: passed
- `git diff --check`: passed
- Local production route smoke tests passed for `/biography`, `/timeline`, `/gallery`, `/documentaries`, `/lessons`, `/tributes`, and `/about`.

## Rollback

Before production deployment, revert merge commit `44c6e433a2526b705269013f15e64997d115a15a` if a rollback is required.

After production deployment, open a focused rollback pull request and verify the Hostinger redeployment. If a live Supabase CMS biography record is created later, archive or unpublish it through the admin workflow rather than deleting remote records without Founder approval.
