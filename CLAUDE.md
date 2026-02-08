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

### Linting and Formatting
- `npm run lint`
- `npx tsc --noEmit` — type check

### Tests
- `npm test` — run all tests (vitest)
- `npx vitest run src/path/to/file.test.ts` — single file
- `npm run test:watch` — watch mode

## Architecture

### High-Level Structure
Single-page React app built with Vite. The carousel auto-advances between EP slides on a 10-second timer, with per-EP theming (colors, fonts) applied via CSS custom properties and `data-theme` attributes. An audio player bar sits at the bottom.

### Key Directories
- `src/data/` — EP theme configuration (track lists, colors, fonts)
- `src/utils/` — Pure utility functions (EKG SVG path generation)
- `src/components/` — Extracted UI components (HeartbeatTitle, StoryProgress, PlayerBar)
- `src/App.tsx` — Carousel orchestration and state management
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

- Use `ReturnType<typeof setTimeout>` for timer refs — `@types/node` is not installed, so `NodeJS.Timeout` won't compile
- EP themes are in `src/data/eps.ts` — add new EPs there (the carousel auto-discovers them)
- CSS theming uses `[data-theme="epid"]` selectors in App.css
