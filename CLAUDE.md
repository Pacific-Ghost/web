# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pacific Ghost band website — an Instagram-story style carousel showcasing EPs with dynamic theming, heartbeat animations, and an audio player.

## Build and Development

### Prerequisites
Node.js 22+ (managed via Volta)

### Setup
`npm install`

### Build
`npm run build` (runs `tsc && vite build`)

### Development Server
`npm run dev`
`npm run preview` — preview production build locally

### Linting and Formatting
- `npm run lint`
- `npx tsc --noEmit` — type check

### Tests
- `npm test` — run all tests (vitest)
- `npx vitest run src/path/to/file.test.ts` — single file
- `npm run test:watch` — watch mode

## Architecture

### High-Level Structure
Single-page React app built with Vite and react-router-dom. Routes: `/ep/:id` (carousel, default), `/bio` (band bio). Three-layer architecture: services (plain TypeScript) → hooks (React bridge) → components (presentation). The AudioPlayer service singleton owns a programmatic `HTMLAudioElement` via `new Audio()`. Page transitions use framer-motion.

### Key Directories
- `src/data/` — EP theme configuration (track lists, colors, fonts)
- `src/services/` — Plain TypeScript modules. No React imports. No `utils/` folder — everything goes here or in hooks.
  - Convention: `services/NameOfThing/NameOfThingService.ts` + `NameOfThingService.test.ts`
- `src/hooks/` — React hooks bridging services to state (useAudioPlayer, useCarousel, useEPTheme)
- `src/components/` — UI components (EPPage, BioPage, HeartbeatTitle, StoryProgress, PlayerBar)
- `src/main.tsx` — Router setup and page-level animated transitions
- `src/App.tsx` — Thin orchestrator wiring hooks to presentation components
- `src/App.css` — All styling (single file, not split by component)

## Technology Stack

React 18, TypeScript, Vite (with SWC plugin), Vitest + Testing Library

## Infrastructure & Deployment

### AWS Resources
- **S3**: `www.pacificghost.fm` bucket hosts the static site; `pacificghost.fm` bucket redirects to `www`
- **CloudFront**: Distribution serves the S3 bucket with custom error responses (403/404 → `index.html`) for SPA routing
- **Route53**: Hosted zone for `pacificghost.fm`

### CDK Stack
The infrastructure is defined in the sibling `/infra` repo using AWS CDK (TypeScript).
- `npx cdk diff` — preview changes
- `npx cdk deploy` — deploy (requires AWS credentials)

### GitHub Actions Deploy Pipeline
`.github/workflows/deploy.yml` triggers on push to `main`:
1. Installs dependencies and builds (`npm ci && npm run build`)
2. Syncs `dist/` to S3
3. Invalidates CloudFront cache

**Required GitHub Secrets:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `PG_WEBSITE_CF_DISTRO_ID` — CloudFront distribution ID

## Common Development Tasks

### Architecture Conventions
- Services are always classes — no loose functions or `utils/` folders
- Use static methods when no internal state is needed (e.g., `EKGService.generatePath`)
- Services use typed event callbacks (e.g., `onPlaybackChange(cb)`) not React patterns
- Service callbacks accept `null` for deregistration
- Hooks bridge services to React via `useState` + `useEffect`
- Components are pure presentation — receive data and callbacks as props
- Callbacks passed into hooks should be stored in refs to avoid effect dependency churn
- Hooks returning two values use array tuples `[value, setter]` (not objects)
- ESLint config is `.eslintrc.cjs` — uses `--max-warnings 0` so any warning fails the build

- Use `ReturnType<typeof setTimeout>` for timer refs — `@types/node` is not installed, so `NodeJS.Timeout` won't compile
- EP themes are in `src/data/eps.ts` — add new EPs there (the carousel auto-discovers them)
- CSS theming uses `[data-theme="epid"]` selectors in App.css
- EP themes support optional `artwork` (webp/jpg/alt/credit) and `links` (spotify/appleMusic/bandcamp) fields
- Routes are defined in `src/main.tsx` — default route redirects to `/ep/lovesickage`
- AudioPlayer tests use a `createMockAudio()` factory with `_fireEvent` helper to simulate HTMLAudioElement events
- useAudioPlayer tests mock the service module and capture callbacks via `_callbacks` record
