# Architecture Refactor: Service Layer + Thin Hooks

## Problem

App.tsx is a god component mixing audio playback, carousel timers, keyboard navigation, and presentation. Heavy use of useEffect/useRef to compensate for imperative audio control wedged into React state. Direct window object access. Logic and JSX interleaved.

## Principles

- Service layer is plain TypeScript — no knowledge of React/JSX
- Hook layer bridges services into React state
- Components are pure presentation
- Dependencies are injected, not imported directly by services

## AudioPlayer Service

`src/services/AudioPlayer.ts`

Plain TypeScript class. Owns an `HTMLAudioElement` created via `new Audio()` — no JSX `<audio>` tag.

```typescript
type Track = { id: number; name: string; file: string }

class AudioPlayer {
  private audio: HTMLAudioElement
  private tracks: Track[]
  private currentTrack: number
  private volume: number

  constructor(initialVolume?: number)

  // Playback
  play(): void
  pause(): void
  toggle(): void
  seek(percent: number): void
  setVolume(volume: number): void

  // Track management
  loadTrack(index: number, autoPlay?: boolean): void
  setTracks(tracks: Track[]): void
  nextTrack(): void
  prevTrack(): void

  // Typed events — framework-agnostic
  onPlaybackChange(cb: (isPlaying: boolean) => void): void
  onProgressChange(cb: (progress: number) => void): void
  onTrackChange(cb: (index: number, name: string) => void): void
  onVolumeChange(cb: (volume: number) => void): void
  onTrackEnded(cb: () => void): void
}
```

Exported as a singleton instance: `export const audioPlayer = new AudioPlayer()`.

## useAudioPlayer Hook

`src/hooks/useAudioPlayer.ts`

Bridges the AudioPlayer singleton into React state.

```typescript
type UseAudioPlayerReturn = {
  isPlaying: boolean
  progress: number
  volume: number
  currentTrack: number
  trackName: string
  play: () => void
  pause: () => void
  toggle: () => void
  nextTrack: () => void
  prevTrack: () => void
  seek: (percent: number) => void
  setVolume: (volume: number) => void
  setTracks: (tracks: Track[]) => void
  loadTrack: (index: number, autoPlay?: boolean) => void
}

function useAudioPlayer(): UseAudioPlayerReturn
```

- Registers listeners via `onPlaybackChange`, `onProgressChange`, etc. in a useEffect
- Each callback sets only its corresponding useState — no wasted re-renders
- Passes through service methods directly
- Cleans up listeners on unmount

## useCarousel Hook

`src/hooks/useCarousel.ts`

Generic carousel with auto-advance timer. No knowledge of EPs, audio, or URLs.

```typescript
type CarouselItemId = string
type Direction = 'left' | 'right'

type UseCarouselReturn = {
  currentItemProgress: number
  autoPlay: boolean
  toggleAutoPlay: () => void
  next: () => void
  prev: () => void
  direction: Direction
}

function useCarousel(
  items: Set<CarouselItemId>,
  currentId: CarouselItemId,
  onNavigate: (id: CarouselItemId) => void,
  slideDuration?: number
): UseCarouselReturn
```

- Manages auto-advance interval and timeout internally
- `onNavigate` callback lets the caller decide what navigation means
- Caller wires side effects (pause audio, reset track) in the callback

## useEPTheme Hook

`src/hooks/useEPTheme.ts`

Centralizes EP theme resolution. Reads route params internally, supports override for non-EP pages.

```typescript
function useEPTheme(overrideId?: string): [EPTheme, (id: string) => void]
```

- Reads `/ep/:id` from route params as default
- Falls back to `EP_THEMES[0].id` if no route param and no override
- `overrideId` takes precedence when provided (BioPage uses this)
- `setTheme(id)` navigates to `/ep/${id}`
- All `getEPById`, route param parsing is internal to the hook
- Array return for clean destructuring: `const [currentTheme, setTheme] = useEPTheme()`

App.tsx usage: `const [currentTheme, setTheme] = useEPTheme()`
BioPage usage: `const [currentTheme] = useEPTheme(fromEP)`

## Revised App.tsx

Thin orchestrator. Calls hooks, passes data to presentation components.

- One useEffect to sync tracks on EP change
- No useRef
- No direct window access
- No keyboard navigation (removed entirely)

## Revised PlayerBar

Pure presentation component. No forwardRef, no audio element, no refs. Receives data and callbacks as props.

## Deletions

- Keyboard navigation (useEffect + window.addEventListener) — removed entirely
- `<audio>` tag from PlayerBar JSX — replaced by programmatic Audio in service
- forwardRef on PlayerBar
- All audioRef/progressIntervalRef/autoPlayTimeoutRef from App.tsx
