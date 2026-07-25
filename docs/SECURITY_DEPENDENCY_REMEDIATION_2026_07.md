# Security Dependency Remediation - July 2026

## Summary

Hostinger reported dependency vulnerabilities on 2026-07-25 affecting `brace-expansion`, `postcss`, and `sharp`. A local `pnpm audit` also reported additional Next.js advisories fixed by `next@15.5.21`.

This remediation branch is `chore/security-dependency-updates-2026-07`.

## Findings Before Remediation

`pnpm audit` reported 13 vulnerabilities:

- High: `sharp <0.35.0` through `next`.
- High: `next >=13.0.0 <15.5.21` Server Actions denial of service.
- High: `next >=14.1.1 <15.5.21` Server Actions SSRF on custom servers.
- High: `next >=12.0.0 <15.5.21` rewrite SSRF.
- High: `postcss <=8.5.11` arbitrary file read through source maps.
- High: `postcss <=8.5.17` source-map path traversal.
- High: `brace-expansion <=5.0.7` denial of service.
- Moderate: `postcss <8.5.10` XSS in CSS stringify output.
- Moderate: five Next.js advisories patched by `next@15.5.21`.

## Dependency Ancestry

### brace-expansion

Before remediation:

- `brace-expansion@1.1.16` through `minimatch@3.1.5`, used by ESLint-related packages including `eslint`, `@eslint/eslintrc`, and `eslint-config-next`.
- `brace-expansion@5.0.7` through `minimatch@10.2.5`, used by TypeScript ESLint packages.
- Classification: transitive development dependency.
- Runtime use: development/linting only.

After remediation:

- `brace-expansion@5.0.8` is the only resolved version.
- Scoped pnpm overrides are used for `minimatch@3.1.5` and `minimatch@10.2.5` because no patched `brace-expansion` 1.x release exists.
- Compatibility evidence: `brace-expansion@5.0.8` publishes a CommonJS `require` export, and `pnpm lint` passed with the ESLint/minimatch chain using the override.

### postcss

Before remediation:

- `postcss@8.4.31` through `next@15.5.20`.
- `postcss@8.5.19` as the direct project dev dependency and Tailwind/PostCSS peer.
- Classification: direct development dependency and transitive Next.js dependency.
- Runtime use: build-time CSS processing.

After remediation:

- `postcss@8.5.22` is the only resolved version.
- A scoped override maps `next>postcss` to `8.5.22` because `next@15.5.21` still declares `postcss@8.4.31`.

### sharp

Before remediation:

- `sharp@0.34.5` through `next@15.5.20`.
- Classification: transitive optional production dependency managed by Next.js.
- Runtime use: production image optimisation.

After remediation:

- `sharp@0.35.0` is resolved through `next@15.5.21`.
- A scoped override maps `next>sharp` to `0.35.0` because `next@15.5.21` still declares `sharp@^0.34.3`.
- Compatibility note: `sharp@0.35.0` requires Node `>=20.9.0`. The local validation environment is Node `26.5.0`; Hostinger must use Node `>=20.9.0`.

## Versions Before And After

| Package | Before | After | Change type | Reason |
| --- | --- | --- | --- | --- |
| `next` | `15.5.20` | `15.5.21` | Patch | Fixes Next.js advisories reported by `pnpm audit`. |
| `eslint-config-next` | `15.5.20` | `15.5.21` | Patch | Keeps Next lint tooling aligned with Next.js. |
| `postcss` | `8.4.31`, `8.5.19` | `8.5.22` | Minor within v8 | Fixes all reported PostCSS advisories. |
| `sharp` | `0.34.5` | `0.35.0` | Minor | Fixes libvips advisory inherited by sharp. |
| `brace-expansion` | `1.1.16`, `5.0.7` | `5.0.8` | Major for the minimatch 3 path | No patched 1.x exists; scoped override validated by lint. |

## Supply-Chain Checks

- `pnpm install --lockfile-only` passed and reported that the lockfile passes supply-chain policies.
- `pnpm install --frozen-lockfile` passed and reported that the lockfile passes supply-chain policies.
- No dependency is fetched from a Git URL, tarball URL, or untrusted HTTP source.
- Package names are existing ecosystem packages already present in the dependency graph.
- Existing build allow-list in `pnpm-workspace.yaml` remains limited to `sharp` and `unrs-resolver`.
- No environment files, credentials, deployment settings, database schema, storage policies, authentication, permissions, public content, or feature code were modified.

## Validation Results

Passed:

- `pnpm install --frozen-lockfile`
- `pnpm audit`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:milestone4-public-home`
- `pnpm test:phase2-landing`
- `pnpm test:cms-core`
- `pnpm test:media-library`
- `pnpm test:admin-polish`
- `pnpm build`
- Owner-executed remote acceptance:

```bash
env -u SUPABASE_SERVICE_ROLE_KEY \
    -u NEXT_PUBLIC_SUPABASE_URL \
    -u NEXT_PUBLIC_SUPABASE_ANON_KEY \
    pnpm test:media-remote
```

The owner reran the exact remote acceptance command in a fresh local Terminal and confirmed it passed completely.

Remote coverage verified:

- All six Supabase Storage buckets.
- JPEG, PNG, WebP, PDF, audio and MP4 uploads.
- `media_items` records, checksums, uploader attribution and original media versions.
- Contributor, reviewer, viewer and owner RLS behaviour.
- Anonymous private-media protection.
- Published public-media access.
- Signed URL creation and expiry.
- Cross-tenant isolation.
- Album workflow.
- CMS media linking and unlinking.
- Unsupported and mismatched MIME rejection.
- Cleanup.

Cleanup confirmed by the owner-run acceptance:

- Temporary users cleaned: 3.
- Temporary media cleaned: 6.
- Temporary storage objects cleaned: 6.

Codex isolated runner note: the same command failed inside this Codex execution environment at Supabase Auth Admin user creation with an ES256 JWT verification error. The owner-verified fresh Terminal run demonstrates this was an isolated runner credential/environment limitation, not a repository failure.

## Audit Results After Remediation

`pnpm audit` reports:

```text
No known vulnerabilities found
```

## Compatibility Notes

- Next.js production build completed with `Next.js 15.5.21`.
- CSS compilation completed with `postcss@8.5.22`.
- The known Supabase Edge Runtime warning remains during build and is unrelated to this dependency remediation.
- `sharp@0.35.0` native package resolution installed successfully under the local Node runtime.
- Hostinger Node compatibility must be confirmed at `>=20.9.0` before production deployment because `sharp@0.35.0` requires it.

## Rollback

To roll back this dependency maintenance branch before merge:

1. Restore `package.json`, `pnpm-lock.yaml`, and `pnpm-workspace.yaml` from `main`.
2. Run `pnpm install --frozen-lockfile`.
3. Re-run `pnpm audit` and the validation suite.

Do not roll back with destructive Git commands unless explicitly approved.

## Current Status

Ready for pull-request review after repository-controlled validation passes. Production deployment still requires owner confirmation that Hostinger uses Node.js `20.9.0` or newer for `sharp@0.35.0`.
