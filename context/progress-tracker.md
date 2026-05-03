# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation

## Current Goal

- Feature 12: (TBD)

## Completed

- Feature 01: Design System - shadcn/ui installed and configured (new-york style, CSS variables, Tailwind v4), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea components added to components/ui/, lucide-react installed, lib/utils.ts has cn() helper, globals.css has full dark-only theme (Ghost AI design tokens + shadcn semantic tokens in :root, @theme inline Tailwind utility mappings).
- Feature 02: Editor Shell - EditorNavbar (fixed top bar, PanelLeftOpen/Close toggle, left/center/right sections), ProjectSidebar (floating overlay, slides in from left, My Projects/Shared tabs with empty states, New Project button), EditorDialog (reusable dialog pattern with title, description, footer - ready for future dialogs). All in components/editor/. No TypeScript or lint errors.
- Feature 03: Auth - ClerkProvider wraps the root layout with the dark theme from @clerk/ui/themes and CSS-variable appearance overrides, `afterSignOutUrl="/sign-in"` is set so logout redirects immediately without a refresh, proxy.ts protects all non-public routes, / redirects signed-in users to /editor and signed-out users to /sign-in, dedicated sign-in and sign-up catch-all routes render Clerk forms in a no-scroll auth shell (`h-screen overflow-hidden`) with a desktop 50:50 split, constrained left-side product copy (`max-w-lg`), and a right-column-centered auth card (`max-w-md`) whose social buttons, divider, email field, and continue button share one width system, and the editor navbar includes Clerk's UserButton.
- Feature 04: Project Dialogs & Editor Home - Editor home screen replaced with minimal centered layout (heading, description, New Project button). `useProjectDialogs` hook in `hooks/use-project-dialogs.ts` manages dialog/form/loading state and holds MOCK_PROJECTS. CreateProjectDialog (live slug preview), RenameProjectDialog (prefilled, autoFocus, Enter submits), DeleteProjectDialog (destructive confirm only) all reuse EditorDialog. ProjectSidebar updated: shows owned project items with hover-revealed rename/delete icon actions, shared tab items have no actions, mobile backdrop scrim added. All actions wired: home New Project → Create, sidebar New Project → Create, sidebar item rename/delete → respective dialogs.
- Feature 05: Prisma Schema & Data Layer - `prisma/models/project.prisma` defines `Project` (ownerId, name, optional description, ProjectStatus enum DRAFT/ARCHIVED, canvasJsonPath, timestamps, indexes on ownerId and createdAt) and `ProjectCollaborator` (projectId cascade-delete relation, email, createdAt, unique on projectId/email, indexes on email and projectId/createdAt). `lib/prisma.ts` exports a cached singleton that uses `accelerateUrl` for `prisma+postgres://` URLs and `@prisma/adapter-pg` (PrismaPg) otherwise; client is cached on `globalThis` in non-production. Migration `20260502172348_init` applied and client generated to `app/generated/prisma/`.
- Feature 06: Project APIs - `app/api/projects/route.ts` handles `GET /api/projects` (list caller's projects ordered by createdAt desc) and `POST /api/projects` (create project, name defaults to "Untitled Project", accepts optional `id` for client-provided room ID). `app/api/projects/[projectId]/route.ts` handles `PATCH /api/projects/[projectId]` (rename, owner-only) and `DELETE /api/projects/[projectId]` (owner-only, returns 204). All routes use `auth()` from `@clerk/nextjs/server`; unauthenticated requests return 401, non-owner mutations return 403.
- Feature 07: Wire Editor Home - `lib/data/projects.ts` provides `getOwnedProjects(userId)` and `getSharedProjects(userEmail)` server-side helpers. `app/editor/page.tsx` is now a server component that fetches both project lists via Clerk auth and passes them to `EditorShell`. `hooks/use-project-actions.ts` manages dialog state and real API mutations: create generates a `slug-suffix` room ID, POSTs with that ID, and navigates to `/editor/[id]`; rename PATCHes and refreshes; delete DELETEs then redirects to `/editor` if on the active workspace or refreshes otherwise. `ProjectSidebar` now accepts real project data as props. All dialogs updated: create shows room ID preview, rename pre-fills current name, delete shows project name. `hooks/use-project-dialogs.ts` (mock) removed.
- Feature 08: Editor Workspace Shell - Added `lib/project-access.ts` with Clerk identity resolution and project access checks by owner or collaborator. Added `/editor/[roomId]` as a server component that redirects unauthenticated users to `/sign-in`, renders `AccessDenied` for missing or unauthorized projects, and loads current project context plus owned/shared project lists for authorized users. `EditorShell` now supports a workspace mode with project-name navbar, share action placeholder, AI sidebar toggle, central canvas placeholder, right AI placeholder panel, existing left project sidebar, and active project highlighting. `components/editor/access-denied.tsx` provides the denied state and link back to `/editor`. Visual polish pass upgraded the shell to a production-grade dark workspace with mesh background, glassmorphism panels, low-contrast canvas grid, radial glow, gradient primary buttons, softer borders, deeper shadows, and improved spacing/typography while keeping the existing layout structure and behavior.
- Feature 09: Share Dialog - `app/api/projects/[projectId]/collaborators/route.ts` handles `GET` (list collaborators, access-gated for owner or collaborator) and `POST` (invite by email, owner-only, 409 on duplicate). `app/api/projects/[projectId]/collaborators/[collaboratorId]/route.ts` handles `DELETE` (owner-only). Both list and invite endpoints enrich collaborator emails with Clerk display name and avatar via `clerkClient().users.getUserList()`, falling back to email-only if no Clerk user is found. `components/editor/share-dialog.tsx` is a client dialog: owners see an email invite field, collaborator list with avatar/name, per-collaborator remove buttons, and a copy-project-link button with "Copied!" feedback; collaborators see the list read-only. `EditorShell` accepts `isOwner` prop, manages share dialog open state, and renders `<ShareDialog>`. The workspace page (`/editor/[roomId]`) computes `isOwner` server-side and passes it down.
- Feature 10: Liveblocks Setup - `liveblocks.config.ts` defines `Presence` (cursor `{x,y}|null` and `isThinking` boolean) and `UserMeta` (id, info with name/avatar/color). `lib/liveblocks.ts` exports a cached `Liveblocks` node client (singleton on `globalThis` in non-production) and a `getCursorColor(userId)` helper that deterministically maps a user ID to one of 7 fixed hex colors via a hash. `app/api/liveblocks-auth/route.ts` handles `POST /api/liveblocks-auth`: requires Clerk auth (401 if not), reads `room` from the request body, verifies project access via `checkProjectAccess` (403 if denied), resolves Clerk user name/avatar, ensures the Liveblocks room exists via `getOrCreateRoom`, and returns an access-token session scoped to that room with `FULL_ACCESS` and user metadata attached. `@liveblocks/node` installed.
- Feature 11: Base Canvas - `types/canvas.ts` defines `CanvasNodeData` (label, color, shape), `CanvasNode` and `CanvasEdge` typed aliases, and exports `NODE_COLORS` (8 dark fill+text pairs) and `NODE_SHAPES` (rectangle, diamond, circle, pill, cylinder, hexagon) constants. `components/editor/canvas-wrapper.tsx` is a client component that sets up `LiveblocksProvider` (authEndpoint `/api/liveblocks-auth`), `RoomProvider` (room ID + initial presence `{cursor:null, isThinking:false}`), a class-based `CanvasErrorBoundary` for connection failures, and `ClientSideSuspense` wrapping a `CanvasFlow` component. `CanvasFlow` calls `useLiveblocksFlow` (suspense, empty initial nodes/edges) and renders `ReactFlow` with `ConnectionMode.Loose`, `fitView`, dot-pattern `Background`, and a dark-themed `MiniMap`. `EditorShell` canvas placeholder replaced with `<CanvasWrapper roomId={activeProject.id} />`. `@xyflow/react/dist/style.css` imported in `globals.css` with React Flow CSS variable overrides for the dark theme.
- Project README - Replaced the default create-next-app README with a concise Ghost AI overview covering current status, core flow, planned stack, architecture notes, local setup, scripts, and context/spec documentation.

## In Progress

- None.

## Next Up

- Feature 12: (TBD)

## Open Questions

- None yet.

## Architecture Decisions

- Dark-only theme: all shadcn CSS variable values are set once in `:root` (no `.dark` toggle class needed).
- Workspace shell polish uses app-level CSS component classes in `globals.css` (`workspace-shell`, `workspace-glass`, `workspace-canvas`, `workspace-primary-button`) so generated `components/ui/*` foundations remain untouched.
- Tailwind v4 `@theme inline` exposes both shadcn semantic tokens and Ghost AI design tokens as Tailwind utilities.
- shadcn style: `base-nova` (auto-selected by shadcn CLI with Tailwind v4 defaults).
- Route protection lives in `proxy.ts` rather than middleware.ts.
- Auth screens use the auth shell as the single source of truth for viewport height and the responsive two-column split: the root owns `h-screen overflow-hidden`, inner columns use `h-full min-h-0` without vertical padding, the left column centers constrained product copy on desktop, the right column centers the constrained auth card, and child Clerk controls stay `w-full` instead of adding independent max-width or margin offsets.
- Do not modify generated `components/ui/*` files.

## Session Notes

- Stack: Next.js 16.2.4, React 19, Tailwind CSS v4 (postcss plugin), TypeScript strict.
- Path alias `@/*` -> project root (tsconfig.json).
- `components.json` uses RSC mode, lucide icon library, `@/lib/utils` for utils alias.
- Feature 08 verification: `npm run build` and `npm run lint` passed on May 2, 2026.
- Feature 08 visual polish verification: `npm run build` and `npm run lint` passed on May 3, 2026.
- Feature 09 verification: `npm run build` passed on May 3, 2026.
- Feature 10 verification: `npm run build` passed on May 3, 2026.
- Feature 11 verification: `npm run build` passed on May 3, 2026.
