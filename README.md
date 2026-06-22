# Bundle Builder

A guided, multi-step product configurator built with React 19, TypeScript and Vite. Users walk through four steps — **Camera → Plan → Sensors → Accessories** — to assemble a bundle. Selections, quantities and per-product variants are persisted to `localStorage` on demand, and a live review panel summarises the bundle with discounts, savings and totals.

## Tech stack

- **React 19** with hooks, `memo`, `useReducer`
- **TypeScript** in `strict` mode (discriminated unions for the product model)
- **Vite 8** + `@vitejs/plugin-react`
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **ESLint 10** with `typescript-eslint` and `eslint-plugin-react-hooks`

## Scripts

```bash
npm install        # install dependencies
npm run dev        # start the Vite dev server
npm run build      # type-check (tsc -b) and build for production
npm run preview    # preview the production build locally
npm run lint       # run ESLint
npm test           # run the Vitest suite once
npm run test:watch # run Vitest in watch mode
```

> On Windows PowerShell, prefer `npm.cmd` / `npx.cmd` if `npm.ps1` execution is blocked by your policy.

## Project layout

```
src/
  App.tsx                  # Root layout — composes accordion steps, purchase and review panels
  main.tsx                 # React entry; wraps the app in <BundleProvider>
  index.css                # Tailwind v4 entry + design tokens

  components/              # Presentational + container components (file names are camelCase, exports stay PascalCase)
    accordion.tsx          # Headless accordion shell driven by useAccordion
    categoryProducts.tsx   # Grid of products for a single category
    productCard.tsx        # Single product with variant selector and quantity stepper
    purchase.tsx           # "Buy the bundle" CTA + savings summary
    quantityStepper.tsx    # +/- quantity control
    reviewPanel.tsx        # Selected-items summary, shipping, totals
    variantSelector.tsx    # Variant thumbnails for a product

  context/
    BundleContext.tsx      # Provider that exposes state + dispatch via React Context
    bundleStore.ts         # Initial state, action creators, selectors

  helpers/
    bundleReducer.ts       # Pure reducer for all bundle actions
    bundleSelections.ts    # Derive selected items, counts and groups
    catalog.ts             # Catalog access helpers
    grouping.ts            # Group items by category for the review panel
    localStorage.ts        # Safe load/save with versioning
    pricing.ts             # Money math in minor units (cents)
    pricing.helper.ts      # Read effective price / discount from a Product union
    productLookup.ts       # Find a product or variant by id
    quantity.ts            # Quantity clamping rules

  hooks/
    useAccordion.ts        # Open-step state, keyboard nav, focus management
    useBundle.ts           # Typed access to BundleContext
    useBundleBuilder.ts    # High-level actions for components (add/remove/setVariant/setQty/save/checkout)
    useLocalStorage.ts     # Generic, SSR-safe localStorage hook
    useReviewPanel.ts      # Derived view model for ReviewPanel

  data/
    products.ts            # Product catalog (cameras, plans, sensors, accessories)
    categoryIcons.tsx      # Icon per category

  icons/                   # SVG icon components
  types/                   # Shared types (bundle, product, review, common)
  utils/
    cn.ts                  # Tailwind class merger
    format.ts              # Currency / count formatting

  test/                    # Vitest test suite (jsdom)
    setup.ts               # jest-dom matchers + matchMedia polyfill + per-test cleanup
    fixtures.ts            # Shared Product / catalog fixtures
    testHelpers/           # One *.test.ts per file in src/helpers
      bundleReducer.test.ts
      bundleSelections.test.ts
      catalog.test.ts
      grouping.test.ts
      localStorage.test.ts
      pricing.helper.test.ts
      pricing.test.ts
      productLookup.test.ts
      quantity.test.ts
    testHooks/             # One *.test.ts(x) per file in src/hooks
      useAccordion.test.ts
      useBundle.test.tsx
      useBundleBuilder.test.ts
      useLocalStorage.test.ts
      useReviewPanel.test.ts
```

## Key concepts

### Money in minor units

All prices are stored as integers in **minor units** (cents) via the `MinorUnits` brand type. This avoids floating-point drift. Format to a display string with `utils/format.ts` only at the UI boundary.

### Discriminated `Product` union

A product is either `ProductWithoutDiscount` (`price` is set, `discount` is `never`) or `ProductWithDiscount` (`discount` is set, `price` is `never`). Always read the active price through the helpers in `helpers/pricing.helper.ts` so the discount path is handled correctly:

```ts
import { getCurrentPrice, getCompareAtPrice, getDiscountAmount } from "./helpers/pricing.helper";
```

### State management

A single `useReducer` in `BundleContext` owns the bundle. Components read state and dispatch actions through the `useBundle` / `useBundleBuilder` hooks — they should not import the reducer directly. Persistence to `localStorage` is **explicit** (triggered by a save action), not automatic on every change.

### Accordion

`useAccordion` is a headless hook: it owns the open step, keyboard navigation (Up/Down/Home/End), focus refs and a `matchMedia('(min-width: 1024px)')` listener. The `Accordion` component is a thin renderer over it.

## Adding a new product

1. Add the product to the correct array in [src/data/products.ts](src/data/products.ts).
2. Use either `price: <MinorUnits>` **or** `discount: { amount, priceBefore, priceAfter }` — never both.
3. If the product has variants, add a `variants` array with `{ id, name, thumbnail }`.
4. The accordion, review panel and pricing are data-driven — no component changes are required.

## Testing

- Test runner: **Vitest** with the **jsdom** environment.
- Component / hook utilities: **@testing-library/react** + **@testing-library/jest-dom**.
- Layout:
  - [src/test/testHelpers/](src/test/testHelpers/) — pure unit tests, one file per module in `src/helpers/`.
  - [src/test/testHooks/](src/test/testHooks/) — hook tests using `renderHook`, one file per module in `src/hooks/`.
  - [src/test/setup.ts](src/test/setup.ts) — registered via `test.setupFiles` in [vite.config.ts](vite.config.ts).
  - [src/test/fixtures.ts](src/test/fixtures.ts) — shared `Product` / `ProductCatalog` fixtures.
- Only files matching `src/test/**/*.test.{ts,tsx}` are picked up.
- Run with `npm test` (CI) or `npm run test:watch` (local).

## Conventions

- Component **file names** are camelCase (`accordion.tsx`), the exported React component stays **PascalCase** (`Accordion`).
- Imports inside `src/` use the **`@/`** alias (configured in [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json)) — e.g. `import { cn } from "@/utils/cn"`. Avoid `./` and `../` relative paths.
- Keep comments minimal — only document non-obvious behavior.
- No new dependencies without a clear reason.
- Don't weaken `tsc`, ESLint or the build step to make a change pass.
