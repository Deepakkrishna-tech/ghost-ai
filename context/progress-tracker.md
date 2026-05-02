# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation

## Current Goal

- Feature 02: (TBD — see feature-specs)

## Completed

- Feature 01: Design System — shadcn/ui installed and configured (new-york style, CSS variables, Tailwind v4), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea components added to components/ui/, lucide-react installed, lib/utils.ts has cn() helper, globals.css has full dark-only theme (Ghost AI design tokens + shadcn semantic tokens in :root, @theme inline Tailwind utility mappings).

## In Progress

- None yet.

## Next Up

- Feature 02: (TBD — see feature-specs)

## Open Questions

- None yet.

## Architecture Decisions

- Dark-only theme: all shadcn CSS variable values are set once in `:root` (no `.dark` toggle class needed).
- Tailwind v4 `@theme inline` exposes both shadcn semantic tokens and Ghost AI design tokens as Tailwind utilities.
- shadcn style: `base-nova` (auto-selected by shadcn CLI with Tailwind v4 defaults).
- Do not modify generated `components/ui/*` files.

## Session Notes

- Stack: Next.js 16.2.4, React 19, Tailwind CSS v4 (postcss plugin), TypeScript strict.
- Path alias `@/*` → project root (tsconfig.json).
- `components.json` uses RSC mode, lucide icon library, `@/lib/utils` for utils alias.
