# Renoza Build Audit

Date: 2026-05-18

## Current Status

The project builds and lints successfully.

Commands run:

- `npm run lint`
- `npm run build`

## Findings

### P1: Required MVP routes are missing

The requested routes are not implemented yet:

- `/projects/new`
- `/projects/[id]`
- `/quote-review`

Impact:

The navigation points to routes that do not exist, and the MVP workflow cannot be tested.

### P2: Mock AI functions exist but are not wired into the UI

`lib/mock-ai.ts` and `lib/types.ts` are useful foundations, but no page currently calls `generateRenovationPlan` or `reviewContractorQuote`.

Impact:

The strongest Renoza differentiation is present in code but not exposed to users yet.

## Recommended Next Claude Pass

Ask Claude to implement:

1. Add `/projects/new` with the renovation intake form.
2. Add `/projects/[id]` with a mock generated plan.
3. Add `/quote-review` with the quote paste/review workflow.
4. Use the existing `lib/mock-ai.ts`, `lib/types.ts`, and `app/actions.ts`.
5. Keep the design practical, mobile-first, and South African market-specific.
