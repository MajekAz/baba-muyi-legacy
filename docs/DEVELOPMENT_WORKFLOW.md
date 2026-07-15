# Development Workflow

LegacyHub development should proceed one focused milestone at a time.

## Standard Workflow

1. Repository audit before major changes.
2. Select one milestone.
3. Create or use a feature branch for material work.
4. Make the smallest coherent change.
5. Run linting.
6. Run type checking.
7. Run production build.
8. Run relevant automated tests.
9. Perform manual acceptance testing.
10. Commit with a clear message.
11. Push branch.
12. Create a Hostinger preview deployment or equivalent preview environment where available.
13. Review and approval by the milestone owner before merge.
14. Merge into `main`.
15. Deploy production.
16. Update changelog and documentation.
17. Keep rollback plan available.

## Branches

- `main`: stable deployment branch.
- `develop`: integrated development branch after the project needs longer-running parallel work.
- `feature/<milestone-name>`: isolated feature work.
- `fix/<issue-name>`: isolated bug fix.

Do not create branches during planning-only milestones unless the user explicitly asks.

## Required Checks Before Commit

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Add feature-specific tests as milestones introduce testable code paths.

## Deployment Rules

- Do not deploy if `pnpm build` fails from the repository root.
- Do not deploy from a GitHub branch that lacks `app/` or `src/app/`.
- Do not deploy with missing required production environment variables.
- Do not deploy Supabase-dependent features until migrations and RLS tests are verified remotely.
- Use Hostinger preview deployment or a controlled preview URL for review when the milestone changes application behavior.
- Merge to `main` only after review, approval, and passing validation.

## GitHub And Hostinger Note

The complete local app must be pushed to `origin/main` before Hostinger can build it. If GitHub only shows `PROJECT_AUDIT.md` and `package.json`, Hostinger will fail because it cannot find `app/`.

## Commit Message Style

- `docs: define LegacyHub product architecture`
- `feat: add workspace-backed CMS repository`
- `fix: include complete Next.js application at repository root`
- `test: add RLS isolation tests`
- `chore: update Hostinger deployment docs`

## Rollback Plan

Every deployment milestone should record:

- Commit hash deployed.
- Migration files applied.
- Environment variables changed.
- Smoke tests run.
- Rollback commit or previous deployment target.
- Steps to revert Hostinger to the previous working deployment.
- Data or migration rollback notes, including whether rollback is safe without data loss.
