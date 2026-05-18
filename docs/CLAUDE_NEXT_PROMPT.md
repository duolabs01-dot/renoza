# Claude Next Prompt

Continue building Renoza.

Codex audit result:

- `npm run lint` passes.
- `npm run build` passes.
- The homepage and layout are Renoza-branded.
- `lib/mock-ai.ts`, `lib/types.ts`, `app/actions.ts`, and `components/Nav.tsx` exist and should be used.

Your task:

1. Add `/projects/new` with a mobile-first renovation intake form.
2. Add `/projects/[id]` showing a generated mock renovation plan.
3. Add `/quote-review` with a textarea and mock review result.
4. Wire UI to `generateRenovationPlan` and `reviewContractorQuote` from `lib/mock-ai.ts`.
5. Use South African rand, budget bands, WhatsApp-ready language, and local renovation risk awareness.

Design direction:

- Practical tool, not decorative landing page.
- Mobile-first.
- Warm, trustworthy, South African, execution-focused.
- Avoid generic purple AI gradients.
- Keep the core promise visible: "From room photo to fair quote."

After implementation:

- Run `npm run lint`.
- Run `npm run build`.
- Summarize files changed and any assumptions.
