# Pacific Ghost Band Site Design

**Date:** 2026-02-07
**Status:** Design Validated
**Interactive Playground:** `docs/reference/design-playground-final.html`

## Overview

Static band website for Pacific Ghost announcing their upcoming EP "Love Sick Age" with a neon 80s hazy synthwave/cyberpunk aesthetic. Dream pop/shoegaze sound translated into atmospheric, melancholic visual design with heavy neon glow effects.

## Technology Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Deployment:** Static HTML/CSS/JS artifacts
- **Audio:** HTML5 Audio API for music player

## Visual Aesthetic

### Color Palette

- **Primary Neon:** `#ff006e` (Hot Pink)
- **Secondary Neon:** `#00d9ff` (Cyan)
- **Background Dark:** `#0a0515` (Very Dark Blue)
- **Text Color:** `#f0f0ff` (Off White)

### Typography

**Headings:**
- Font: Futura / Century Gothic / AppleGothic (geometric sans-serif)
- Size: 80px
- Weight: 900 (Black)
- Letter Spacing: 6px
- Transform: UPPERCASE
- Effect: Neon glow with primary and secondary colors

**Body Text:**
- Font: Gill Sans / Calibri (elegant sans-serif)
- Letter Spacing: 0.5px
- Opacity: 0.7-0.8 for description text

**Subtitle/Labels:**
- Font: Body font stack
- Letter Spacing: 8px (wide)
- Transform: UPPERCASE
- Size: 20px

### Atmospheric Effects

1. **Neon Glow Background:** Radial gradients of primary/secondary colors at ~15% opacity
2. **Grid Overlay:** Subtle neon grid pattern (~20% opacity)
3. **Film Grain:** Light grain texture (~6% opacity)
4. **Scan Lines:** Very subtle horizontal lines (~3% opacity)
5. **Haze/Fog:** Atmospheric color bleeding effect

### Iconography

Geometric symbols used throughout:
- `◆` Diamond
- `⬡` Hexagon
- `◈` Square in diamond
- `▶` Play triangle

Used in:
- Subtitle framing (`◆ Love Sick Age ◆`)
- Streaming link icons
- Volume control icon
- Artwork pattern overlay
- Corner accent decorations

## Layout Structure

### Content Hierarchy

1. **Artwork Section (Hero)**
   - Centered, max-width 600px
   - EP artwork in neon-bordered frame (4px solid primary color)
   - Border glow effect: 20px blur on primary + secondary colors
   - Radial glow behind artwork at 70% intensity
   - Geometric pattern overlay on artwork
   - Artwork icon: Hexagon symbol `⬡`

2. **Band Info Section**
   - Centered, max-width 800px
   - Subtitle: "◆ Love Sick Age ◆" (EP name)
   - Main Title: "PACIFIC GHOST" (band name, split across 2 lines)
   - Description: Brief EP description
   - Streaming Links: Horizontal flex layout with icon + label buttons

3. **Fixed Player Bar (Bottom)**
   - Docked to bottom of viewport
   - 85% opacity background
   - 20px backdrop blur
   - Border: 2px solid primary color
   - Glow effect on top edge
   - Controls: Previous, Play/Pause, Next buttons
   - Track info: Name + progress bar
   - Volume control: Icon + slider

### Spacing

- Page padding: 100px top, 60px horizontal, 160px bottom
- Artwork to info: 80px margin
- Info to links: 50px margin
- Link buttons: 24px gap
- Player internal: 24px padding, 32px gap between sections

## Components Structure

### Component Breakdown

1. **App.tsx** - Root component, layout container
2. **ArtworkSection.tsx** - EP artwork with glow effects
3. **BandInfo.tsx** - Title, subtitle, description, links
4. **PlayerBar.tsx** - Fixed bottom audio player
5. **AtmosphericLayers.tsx** - Background effects (grid, grain, glow)
6. **CornerAccents.tsx** - Decorative corner borders

### Styling Approach

- CSS Modules or Styled Components for component-scoped styles
- Shared theme constants file for colors, fonts, spacing
- Responsive breakpoints: Mobile-first approach

## Audio Player Functionality

### Features

- Play/pause/skip controls
- Visual progress bar with gradient fill (primary → secondary)
- Track name display with current track number
- Volume control with slider
- 5 full-length tracks from "Love Sick Age" EP

### Track List (Placeholder)

1. Fading Streetlights
2. [Track 2 name]
3. [Track 3 name]
4. [Track 4 name]
5. [Track 5 name]

### Implementation

- HTML5 Audio API
- Audio files: MP3 format for broad compatibility
- Preload strategy: metadata only, load on play
- State management: React useState/useContext for player state

## Responsive Design

### Breakpoints

- **Desktop:** 1024px+ (default design)
- **Tablet:** 768px - 1023px
  - Reduce heading size to 60px
  - Reduce artwork max-width to 450px
  - Reduce horizontal padding to 40px

- **Mobile:** < 768px
  - Heading size: 48px
  - Artwork max-width: 100% (with side padding)
  - Stack player controls vertically if needed
  - Reduce letter spacing on headings
  - Horizontal padding: 24px

## Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS backdrop-filter for blur effects
- HTML5 Audio API

## Performance Considerations

- Lazy load audio files
- Optimize artwork image (WebP with PNG fallback)
- Minimize CSS animations (use GPU-accelerated transforms)
- Static site generation for fast initial load
- Minimize bundle size with tree-shaking

## Deployment

- Build output: Static HTML/CSS/JS
- Deploy to: Netlify, Vercel, GitHub Pages, or any static host
- Build command: `npm run build`
- Output directory: `dist/`

## Future Enhancements (Post-MVP)

- Animated glow pulse on artwork
- Parallax scrolling effects
- More elaborate background animations
- Social media share functionality
- Email signup form for release updates
- Tour dates section (if applicable)

## Design Reference

The final validated design can be explored interactively at:
`docs/reference/design-playground-final.html`

Open in browser to adjust and preview any design variations.
