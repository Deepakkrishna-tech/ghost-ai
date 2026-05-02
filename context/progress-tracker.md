# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation

## Current Goal

- Feature 03: Auth - Clerk provider, sign-in/sign-up pages, proxy-based route protection, and editor user menu

## Completed

- Feature 01: Design System - shadcn/ui installed and configured (new-york style, CSS variables, Tailwind v4), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea components added to components/ui/, lucide-react installed, lib/utils.ts has cn() helper, globals.css has full dark-only theme (Ghost AI design tokens + shadcn semantic tokens in :root, @theme inline Tailwind utility mappings).
- Feature 02: Editor Shell - EditorNavbar (fixed top bar, PanelLeftOpen/Close toggle, left/center/right sections), ProjectSidebar (floating overlay, slides in from left, My Projects/Shared tabs with empty states, New Project button), EditorDialog (reusable dialog pattern with title, description, footer - ready for future dialogs). All in components/editor/. No TypeScript or lint errors.
- Feature 03: Auth - ClerkProvider wraps the root layout with the dark theme from @clerk/ui/themes and CSS-variable appearance overrides, `afterSignOutUrl="/sign-in"` is set so logout redirects immediately without a refresh, proxy.ts protects all non-public routes, / redirects signed-in users to /editor and signed-out users to /sign-in, dedicated sign-in and sign-up catch-all routes render Clerk forms in a no-scroll auth shell (`h-screen overflow-hidden`) with a desktop 50:50 split, constrained left-side product copy (`max-w-lg`), and a right-column-centered auth card (`max-w-md`) whose social buttons, divider, email field, and continue button share one width system, and the editor navbar includes Clerk's UserButton.

## In Progress

- None.

## Next Up

- Feature 04: (TBD - see feature-specs)

## Open Questions

- None yet.

## Architecture Decisions

- Dark-only theme: all shadcn CSS variable values are set once in `:root` (no `.dark` toggle class needed).
- Tailwind v4 `@theme inline` exposes both shadcn semantic tokens and Ghost AI design tokens as Tailwind utilities.
- shadcn style: `base-nova` (auto-selected by shadcn CLI with Tailwind v4 defaults).
- Route protection lives in `proxy.ts` rather than middleware.ts.
- Auth screens use the auth shell as the single source of truth for viewport height and the responsive two-column split: the root owns `h-screen overflow-hidden`, inner columns use `h-full min-h-0` without vertical padding, the left column centers constrained product copy on desktop, the right column centers the constrained auth card, and child Clerk controls stay `w-full` instead of adding independent max-width or margin offsets.
- Do not modify generated `components/ui/*` files.

## Session Notes

- Stack: Next.js 16.2.4, React 19, Tailwind CSS v4 (postcss plugin), TypeScript strict.
- Path alias `@/*` -> project root (tsconfig.json).
- `components.json` uses RSC mode, lucide icon library, `@/lib/utils` for utils alias.
