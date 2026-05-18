# Renoza Build Audit

Date: 2026-05-18

## Current Status

The project builds and lints successfully.

Commands run:

- `npm run lint`
- `npm run build`

## Findings

### P2: Photo upload is still a placeholder

The project intake screen includes a room photo upload placeholder, but there is no actual file upload, storage, or vision analysis yet.

Impact:

The first MVP can still be tested, but Renoza's "room photo to fair quote" promise is not complete until uploads are connected.

### P2: AI output is deterministic mock data

`generateRenovationPlan` and `reviewContractorQuote` are wired into the UI, but they return typed mock responses.

Impact:

The UX is testable, but real personalization will need a server-side AI integration.

### P3: Some UI icons are emoji placeholders

Several cards/actions use emoji symbols. This is acceptable for a quick scaffold, but the polished product should use a consistent icon set such as lucide-react.

## Recommended Next Claude Pass

Ask Claude to implement:

1. Replace emoji placeholders with lucide-react icons.
2. Add real file upload state for room photos, even if uploads are only previewed locally at first.
3. Move mock generation behind server actions so Claude/OpenAI can be connected cleanly.
4. Add Supabase schema and storage plan.
5. Add basic smoke tests or Playwright flow checks for plan generation and quote review.
