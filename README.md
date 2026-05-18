# Renoza

Renoza is an AI renovation planning platform for South African homes.

Tagline:

> From room photo to fair quote.

## Product Direction

Renoza helps homeowners turn renovation uncertainty into a practical plan:

- room and budget intake
- rand-based cost ranges
- renovation risks and hidden-cost flags
- WhatsApp-ready contractor briefs
- contractor quote review
- contextual sponsored recommendations for renovation brands

The design direction is premium but grounded: Houzz-style aspiration, Linear-style clarity, and a South African renovation reality layer.

## Animation Architecture

- `framer-motion` powers page entry, section reveals, form step transitions, hover states, copy states, counters, and loading overlays.
- `@remotion/player` + `remotion` power inline animated visuals:
  - `BudgetGauge`
  - `CostBreakdownChart`
  - `TimelinePlayer`
- Motion respects `prefers-reduced-motion` where the interaction is not essential.

## Design System

Brand palette is defined in `app/globals.css`:

- Petrol: `#1E5541`, `#338567`, `#85C0A8`
- Clay: `#C7603E`, `#E27A4D`
- Canvas: `#FAF8F5`, `#F2EDE7`
- Charcoal: `#2D2D2D`, `#4A4A4A`

Typography:

- Display: Playfair Display
- Body/UI: Inter
- Costs use tabular numbers and large, confident treatment.

## Routes

- `/` home and product narrative
- `/projects/new` multi-step renovation intake
- `/projects/[id]` generated renovation plan
- `/quote-review` contractor quote review
- `/projects` mock saved projects dashboard
- `/quote-comparison` mock multi-quote comparison

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run build
```
