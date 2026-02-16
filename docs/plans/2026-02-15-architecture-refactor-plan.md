# Architecture Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract audio logic into a plain TypeScript service, carousel/theme logic into hooks, and reduce App.tsx to a thin orchestrator with pure presentation components.

**Architecture:** AudioPlayer singleton class (plain TS) owns the HTMLAudioElement. Three hooks bridge concerns into React: useAudioPlayer (subscribes to service events), useCarousel (timer + navigation), useEPTheme (route-based theme resolution). App.tsx wires them together. PlayerBar becomes pure presentation.

**Tech Stack:** React 18, TypeScript, Vitest + Testing Library, react-router-dom

---

### Task 1: AudioPlayer Service

**Files:**
- Create: `src/services/AudioPlayer.ts`
- Create: `src/services/AudioPlayer.test.ts`

**Step 1: Write the failing tests**

```typescript
// src/services/AudioPlayer.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AudioPlayer } from './AudioPlayer'

// Mock HTMLAudioElement
function createMockAudio() {
  const listeners: Record<string, Function[]> = {}
  return {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    load: vi.fn(),
    addEventListener: vi.fn((event: string, cb: Function) => {
      listeners[event] = listeners[event] || []
      listeners[event].push(cb)
    }),
    removeEventListener: vi.fn(),
    volume: 1,
    currentTime: 0,
    duration: 100,
    src: '',
    _listeners: listeners,
    _fireEvent(name: string) {
      (listeners[name] || []).forEach(cb => cb())
    },
  } as unknown as HTMLAudioElement & { _listeners: Record<string, Function[]>; _fireEvent: (name: string) => void }
}

describe('AudioPlayer', () => {
  let player: AudioPlayer
  let mockAudio: ReturnType<typeof createMockAudio>

  beforeEach(() => {
    mockAudio = createMockAudio()
    player = new AudioPlayer(() => mockAudio)
  })

  describe('constructor', () => {
    it('sets initial volume to 70 by default', () => {
      expect(mockAudio.volume).toBe(0.7)
    })

    it('accepts custom initial volume', () => {
      const audio = createMockAudio()
      new AudioPlayer(() => audio, 50)
      expect(audio.volume).toBe(0.5)
    })
  })

  describe('setTracks', () => {
    it('stores tracks for later use', () => {
      const tracks = [
        { id: 1, name: 'Track 1', file: '/audio/track1.mp3' },
        { id: 2, name: 'Track 2', file: '/audio/track2.mp3' },
      ]
      player.setTracks(tracks)
      player.loadTrack(0)
      expect(mockAudio.src).toBe('/audio/track1.mp3')
    })
  })

  describe('loadTrack', () => {
    const tracks = [
      { id: 1, name: 'Track 1', file: '/audio/track1.mp3' },
      { id: 2, name: 'Track 2', file: '/audio/track2.mp3' },
    ]

    beforeEach(() => {
      player.setTracks(tracks)
    })

    it('sets audio src and calls load', () => {
      player.loadTrack(1)
      expect(mockAudio.src).toBe('/audio/track2.mp3')
      expect(mockAudio.load).toHaveBeenCalled()
    })

    it('fires onTrackChange callback', () => {
      const cb = vi.fn()
      player.onTrackChange(cb)
      player.loadTrack(1)
      expect(cb).toHaveBeenCalledWith(1, 'Track 2')
    })

    it('auto-plays when autoPlay is true', () => {
      player.loadTrack(0, true)
      expect(mockAudio.play).toHaveBeenCalled()
    })

    it('does not auto-play by default', () => {
      player.loadTrack(0)
      expect(mockAudio.play).not.toHaveBeenCalled()
    })
  })

  describe('play/pause/toggle', () => {
    it('play calls audio.play and fires onPlaybackChange', () => {
      const cb = vi.fn()
      player.onPlaybackChange(cb)
      player.play()
      expect(mockAudio.play).toHaveBeenCalled()
      expect(cb).toHaveBeenCalledWith(true)
    })

    it('pause calls audio.pause and fires onPlaybackChange', () => {
      const cb = vi.fn()
      player.onPlaybackChange(cb)
      player.pause()
      expect(mockAudio.pause).toHaveBeenCalled()
      expect(cb).toHaveBeenCalledWith(false)
    })

    it('toggle alternates between play and pause', () => {
      const cb = vi.fn()
      player.onPlaybackChange(cb)
      player.toggle() // should play
      expect(cb).toHaveBeenCalledWith(true)
      player.toggle() // should pause
      expect(cb).toHaveBeenCalledWith(false)
    })
  })

  describe('seek', () => {
    it('sets currentTime based on percent', () => {
      mockAudio.duration = 200
      player.seek(50)
      expect(mockAudio.currentTime).toBe(100)
    })
  })

  describe('setVolume', () => {
    it('sets audio volume and fires onVolumeChange', () => {
      const cb = vi.fn()
      player.onVolumeChange(cb)
      player.setVolume(30)
      expect(mockAudio.volume).toBe(0.3)
      expect(cb).toHaveBeenCalledWith(30)
    })
  })

  describe('nextTrack/prevTrack', () => {
    const tracks = [
      { id: 1, name: 'A', file: '/a.mp3' },
      { id: 2, name: 'B', file: '/b.mp3' },
      { id: 3, name: 'C', file: '/c.mp3' },
    ]

    beforeEach(() => {
      player.setTracks(tracks)
      player.loadTrack(0)
    })

    it('nextTrack advances and wraps', () => {
      const cb = vi.fn()
      player.onTrackChange(cb)
      player.nextTrack()
      expect(cb).toHaveBeenCalledWith(1, 'B')
      player.nextTrack()
      expect(cb).toHaveBeenCalledWith(2, 'C')
      player.nextTrack()
      expect(cb).toHaveBeenCalledWith(0, 'A') // wraps
    })

    it('prevTrack goes back and wraps', () => {
      const cb = vi.fn()
      player.onTrackChange(cb)
      player.prevTrack()
      expect(cb).toHaveBeenCalledWith(2, 'C') // wraps to end
    })
  })

  describe('onProgressChange', () => {
    it('fires on audio timeupdate', () => {
      const cb = vi.fn()
      player.onProgressChange(cb)
      mockAudio.currentTime = 25
      mockAudio.duration = 100
      mockAudio._fireEvent('timeupdate')
      expect(cb).toHaveBeenCalledWith(25)
    })
  })

  describe('onTrackEnded', () => {
    it('fires on audio ended event', () => {
      const cb = vi.fn()
      player.onTrackEnded(cb)
      mockAudio._fireEvent('ended')
      expect(cb).toHaveBeenCalled()
    })
  })
})
```

Note: The constructor takes an optional factory function `createAudio: () => HTMLAudioElement` for dependency injection in tests. In production it defaults to `() => new Audio()`.

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/services/AudioPlayer.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

```typescript
// src/services/AudioPlayer.ts

export type Track = { id: number; name: string; file: string }

type PlaybackChangeCallback = (isPlaying: boolean) => void
type ProgressChangeCallback = (progress: number) => void
type TrackChangeCallback = (index: number, name: string) => void
type VolumeChangeCallback = (volume: number) => void
type TrackEndedCallback = () => void

export class AudioPlayer {
  private audio: HTMLAudioElement
  private tracks: Track[] = []
  private currentTrackIndex = 0
  private playing = false

  private playbackChangeCallback: PlaybackChangeCallback | null = null
  private progressChangeCallback: ProgressChangeCallback | null = null
  private trackChangeCallback: TrackChangeCallback | null = null
  private volumeChangeCallback: VolumeChangeCallback | null = null
  private trackEndedCallback: TrackEndedCallback | null = null

  constructor(
    createAudio: () => HTMLAudioElement = () => new Audio(),
    initialVolume = 70,
  ) {
    this.audio = createAudio()
    this.audio.volume = initialVolume / 100
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
    this.audio.addEventListener('ended', this.handleEnded)
  }

  // Playback

  play(): void {
    this.audio.play()
    this.playing = true
    this.playbackChangeCallback?.(true)
  }

  pause(): void {
    this.audio.pause()
    this.playing = false
    this.playbackChangeCallback?.(false)
  }

  toggle(): void {
    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  seek(percent: number): void {
    if (this.audio.duration) {
      this.audio.currentTime = (percent / 100) * this.audio.duration
    }
  }

  setVolume(volume: number): void {
    this.audio.volume = volume / 100
    this.volumeChangeCallback?.(volume)
  }

  // Track management

  setTracks(tracks: Track[]): void {
    this.tracks = tracks
  }

  loadTrack(index: number, autoPlay = false): void {
    this.currentTrackIndex = index
    const track = this.tracks[index]
    if (!track) return
    this.audio.src = track.file
    this.audio.load()
    this.trackChangeCallback?.(index, track.name)
    if (autoPlay) {
      this.play()
    }
  }

  nextTrack(): void {
    const next = (this.currentTrackIndex + 1) % this.tracks.length
    this.loadTrack(next, this.playing)
  }

  prevTrack(): void {
    const prev = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length
    this.loadTrack(prev, this.playing)
  }

  // Event registration

  onPlaybackChange(cb: PlaybackChangeCallback): void {
    this.playbackChangeCallback = cb
  }

  onProgressChange(cb: ProgressChangeCallback): void {
    this.progressChangeCallback = cb
  }

  onTrackChange(cb: TrackChangeCallback): void {
    this.trackChangeCallback = cb
  }

  onVolumeChange(cb: VolumeChangeCallback): void {
    this.volumeChangeCallback = cb
  }

  onTrackEnded(cb: TrackEndedCallback): void {
    this.trackEndedCallback = cb
  }

  // Private handlers

  private handleTimeUpdate = (): void => {
    if (this.audio.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100
      this.progressChangeCallback?.(progress)
    }
  }

  private handleEnded = (): void => {
    this.trackEndedCallback?.()
  }
}

export const audioPlayer = new AudioPlayer()
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/services/AudioPlayer.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/services/AudioPlayer.ts src/services/AudioPlayer.test.ts
git commit -m "feat: add AudioPlayer service class with typed events"
```

---

### Task 2: useAudioPlayer Hook

**Files:**
- Create: `src/hooks/useAudioPlayer.ts`
- Create: `src/hooks/useAudioPlayer.test.ts`

**Step 1: Write the failing tests**

```typescript
// src/hooks/useAudioPlayer.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudioPlayer } from './useAudioPlayer'
import { audioPlayer } from '../services/AudioPlayer'

vi.mock('../services/AudioPlayer', () => {
  const callbacks: Record<string, Function> = {}
  return {
    audioPlayer: {
      play: vi.fn(),
      pause: vi.fn(),
      toggle: vi.fn(),
      seek: vi.fn(),
      setVolume: vi.fn(),
      setTracks: vi.fn(),
      loadTrack: vi.fn(),
      nextTrack: vi.fn(),
      prevTrack: vi.fn(),
      onPlaybackChange: vi.fn((cb: Function) => { callbacks.playback = cb }),
      onProgressChange: vi.fn((cb: Function) => { callbacks.progress = cb }),
      onTrackChange: vi.fn((cb: Function) => { callbacks.track = cb }),
      onVolumeChange: vi.fn((cb: Function) => { callbacks.volume = cb }),
      onTrackEnded: vi.fn((cb: Function) => { callbacks.ended = cb }),
      _callbacks: callbacks,
    },
  }
})

const mock = audioPlayer as unknown as typeof audioPlayer & { _callbacks: Record<string, Function> }

describe('useAudioPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers all event listeners on mount', () => {
    renderHook(() => useAudioPlayer())
    expect(audioPlayer.onPlaybackChange).toHaveBeenCalled()
    expect(audioPlayer.onProgressChange).toHaveBeenCalled()
    expect(audioPlayer.onTrackChange).toHaveBeenCalled()
    expect(audioPlayer.onVolumeChange).toHaveBeenCalled()
    expect(audioPlayer.onTrackEnded).toHaveBeenCalled()
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useAudioPlayer())
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.progress).toBe(0)
    expect(result.current.volume).toBe(70)
    expect(result.current.currentTrack).toBe(0)
    expect(result.current.trackName).toBe('')
  })

  it('updates isPlaying when onPlaybackChange fires', () => {
    const { result } = renderHook(() => useAudioPlayer())
    act(() => { mock._callbacks.playback(true) })
    expect(result.current.isPlaying).toBe(true)
  })

  it('updates progress when onProgressChange fires', () => {
    const { result } = renderHook(() => useAudioPlayer())
    act(() => { mock._callbacks.progress(42.5) })
    expect(result.current.progress).toBe(42.5)
  })

  it('updates track info when onTrackChange fires', () => {
    const { result } = renderHook(() => useAudioPlayer())
    act(() => { mock._callbacks.track(2, 'Ambulance') })
    expect(result.current.currentTrack).toBe(2)
    expect(result.current.trackName).toBe('Ambulance')
  })

  it('updates volume when onVolumeChange fires', () => {
    const { result } = renderHook(() => useAudioPlayer())
    act(() => { mock._callbacks.volume(30) })
    expect(result.current.volume).toBe(30)
  })

  it('passes through service methods', () => {
    const { result } = renderHook(() => useAudioPlayer())
    result.current.toggle()
    expect(audioPlayer.toggle).toHaveBeenCalled()
    result.current.seek(50)
    expect(audioPlayer.seek).toHaveBeenCalledWith(50)
    result.current.setVolume(80)
    expect(audioPlayer.setVolume).toHaveBeenCalledWith(80)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useAudioPlayer.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

```typescript
// src/hooks/useAudioPlayer.ts
import { useState, useEffect } from 'react'
import { audioPlayer, Track } from '../services/AudioPlayer'

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(70)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [trackName, setTrackName] = useState('')

  useEffect(() => {
    audioPlayer.onPlaybackChange(setIsPlaying)
    audioPlayer.onProgressChange(setProgress)
    audioPlayer.onTrackChange((index, name) => {
      setCurrentTrack(index)
      setTrackName(name)
    })
    audioPlayer.onVolumeChange(setVolume)
    audioPlayer.onTrackEnded(() => audioPlayer.nextTrack())

    return () => {
      audioPlayer.onPlaybackChange(null as never)
      audioPlayer.onProgressChange(null as never)
      audioPlayer.onTrackChange(null as never)
      audioPlayer.onVolumeChange(null as never)
      audioPlayer.onTrackEnded(null as never)
    }
  }, [])

  return {
    isPlaying,
    progress,
    volume,
    currentTrack,
    trackName,
    play: () => audioPlayer.play(),
    pause: () => audioPlayer.pause(),
    toggle: () => audioPlayer.toggle(),
    nextTrack: () => audioPlayer.nextTrack(),
    prevTrack: () => audioPlayer.prevTrack(),
    seek: (percent: number) => audioPlayer.seek(percent),
    setVolume: (v: number) => audioPlayer.setVolume(v),
    setTracks: (tracks: Track[]) => audioPlayer.setTracks(tracks),
    loadTrack: (index: number, autoPlay?: boolean) => audioPlayer.loadTrack(index, autoPlay),
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useAudioPlayer.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/hooks/useAudioPlayer.ts src/hooks/useAudioPlayer.test.ts
git commit -m "feat: add useAudioPlayer hook bridging service to React state"
```

---

### Task 3: useCarousel Hook

**Files:**
- Create: `src/hooks/useCarousel.ts`
- Create: `src/hooks/useCarousel.test.ts`

**Step 1: Write the failing tests**

```typescript
// src/hooks/useCarousel.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCarousel } from './useCarousel'

describe('useCarousel', () => {
  const items = new Set(['a', 'b', 'c'])
  let onNavigate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onNavigate = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', onNavigate))
    expect(result.current.currentItemProgress).toBe(0)
    expect(result.current.autoPlay).toBe(false)
    expect(result.current.direction).toBe('right')
  })

  it('next navigates to the next item', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', onNavigate))
    act(() => { result.current.next() })
    expect(onNavigate).toHaveBeenCalledWith('b')
  })

  it('next wraps from last to first', () => {
    const { result } = renderHook(() => useCarousel(items, 'c', onNavigate))
    act(() => { result.current.next() })
    expect(onNavigate).toHaveBeenCalledWith('a')
  })

  it('prev navigates to the previous item', () => {
    const { result } = renderHook(() => useCarousel(items, 'b', onNavigate))
    act(() => { result.current.prev() })
    expect(onNavigate).toHaveBeenCalledWith('a')
  })

  it('prev wraps from first to last', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', onNavigate))
    act(() => { result.current.prev() })
    expect(onNavigate).toHaveBeenCalledWith('c')
  })

  it('direction is right after next', () => {
    const { result, rerender } = renderHook(
      ({ id }) => useCarousel(items, id, onNavigate),
      { initialProps: { id: 'a' } },
    )
    act(() => { result.current.next() })
    rerender({ id: 'b' })
    expect(result.current.direction).toBe('right')
  })

  it('direction is left after prev', () => {
    const { result, rerender } = renderHook(
      ({ id }) => useCarousel(items, id, onNavigate),
      { initialProps: { id: 'b' } },
    )
    act(() => { result.current.prev() })
    rerender({ id: 'a' })
    expect(result.current.direction).toBe('left')
  })

  it('auto-advance calls onNavigate after slideDuration', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', onNavigate, 5000))
    act(() => { result.current.toggleAutoPlay() })
    expect(result.current.autoPlay).toBe(true)
    act(() => { vi.advanceTimersByTime(5000) })
    expect(onNavigate).toHaveBeenCalledWith('b')
  })

  it('currentItemProgress increases during autoPlay', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', onNavigate, 10000))
    act(() => { result.current.toggleAutoPlay() })
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current.currentItemProgress).toBeGreaterThan(40)
    expect(result.current.currentItemProgress).toBeLessThan(60)
  })

  it('toggleAutoPlay disables auto-advance', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', onNavigate, 5000))
    act(() => { result.current.toggleAutoPlay() }) // enable
    act(() => { result.current.toggleAutoPlay() }) // disable
    expect(result.current.autoPlay).toBe(false)
    act(() => { vi.advanceTimersByTime(10000) })
    expect(onNavigate).not.toHaveBeenCalled()
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useCarousel.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

```typescript
// src/hooks/useCarousel.ts
import { useState, useEffect, useRef } from 'react'

export type CarouselItemId = string
export type Direction = 'left' | 'right'

const DEFAULT_SLIDE_DURATION = 10000

export function useCarousel(
  items: Set<CarouselItemId>,
  currentId: CarouselItemId,
  onNavigate: (id: CarouselItemId) => void,
  slideDuration = DEFAULT_SLIDE_DURATION,
) {
  const [autoPlay, setAutoPlay] = useState(false)
  const [currentItemProgress, setCurrentItemProgress] = useState(0)

  const directionRef = useRef<Direction>('right')
  const prevIdRef = useRef(currentId)

  const itemsArray = Array.from(items)
  const currentIndex = itemsArray.indexOf(currentId)

  // Track direction when currentId changes
  if (prevIdRef.current !== currentId) {
    const prevIndex = itemsArray.indexOf(prevIdRef.current)
    const len = itemsArray.length
    const forwardDist = (currentIndex - prevIndex + len) % len
    const backwardDist = (prevIndex - currentIndex + len) % len
    directionRef.current = forwardDist <= backwardDist ? 'right' : 'left'
    prevIdRef.current = currentId
  }

  const next = () => {
    directionRef.current = 'right'
    const nextIndex = (currentIndex + 1) % itemsArray.length
    onNavigate(itemsArray[nextIndex])
  }

  const prev = () => {
    directionRef.current = 'left'
    const prevIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length
    onNavigate(itemsArray[prevIndex])
  }

  const toggleAutoPlay = () => {
    setAutoPlay(prev => !prev)
  }

  // Auto-advance timer
  useEffect(() => {
    if (!autoPlay) {
      setCurrentItemProgress(0)
      return
    }

    setCurrentItemProgress(0)

    const progressInterval = setInterval(() => {
      setCurrentItemProgress(prev => {
        const next = prev + 100 / (slideDuration / 100)
        return Math.min(next, 100)
      })
    }, 100)

    const advanceTimeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % itemsArray.length
      onNavigate(itemsArray[nextIndex])
    }, slideDuration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(advanceTimeout)
    }
  }, [currentId, autoPlay, slideDuration])

  return {
    currentItemProgress,
    autoPlay,
    toggleAutoPlay,
    next,
    prev,
    direction: directionRef.current,
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useCarousel.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/hooks/useCarousel.ts src/hooks/useCarousel.test.ts
git commit -m "feat: add useCarousel hook with auto-advance timer"
```

---

### Task 4: useEPTheme Hook

**Files:**
- Create: `src/hooks/useEPTheme.ts`
- Create: `src/hooks/useEPTheme.test.ts`

**Step 1: Write the failing tests**

```typescript
// src/hooks/useEPTheme.test.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useEPTheme } from './useEPTheme'
import { EP_THEMES } from '../data/eps'
import React from 'react'

const wrapper = (initialRoute: string) => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/ep/:id" element={children} />
        <Route path="/bio" element={children} />
        <Route path="*" element={children} />
      </Routes>
    </MemoryRouter>
  )
}

describe('useEPTheme', () => {
  it('resolves theme from route params', () => {
    const { result } = renderHook(() => useEPTheme(), {
      wrapper: wrapper('/ep/thehill'),
    })
    const [theme] = result.current
    expect(theme.id).toBe('thehill')
  })

  it('falls back to first EP when no route param and no override', () => {
    const { result } = renderHook(() => useEPTheme(), {
      wrapper: wrapper('/bio'),
    })
    const [theme] = result.current
    expect(theme.id).toBe(EP_THEMES[0].id)
  })

  it('overrideId takes precedence over route params', () => {
    const { result } = renderHook(() => useEPTheme('thehill'), {
      wrapper: wrapper('/ep/lovesickage'),
    })
    const [theme] = result.current
    expect(theme.id).toBe('thehill')
  })

  it('returns a setTheme function', () => {
    const { result } = renderHook(() => useEPTheme(), {
      wrapper: wrapper('/ep/lovesickage'),
    })
    const [, setTheme] = result.current
    expect(typeof setTheme).toBe('function')
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useEPTheme.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

```typescript
// src/hooks/useEPTheme.ts
import { useParams, useNavigate } from 'react-router-dom'
import { EPTheme, getEPById, EP_THEMES } from '../data/eps'

export function useEPTheme(overrideId?: string): [EPTheme, (id: string) => void] {
  const { id: routeId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const epId = overrideId ?? routeId ?? EP_THEMES[0].id
  const theme = getEPById(epId)

  const setTheme = (id: string) => {
    navigate(`/ep/${id}`)
  }

  return [theme, setTheme]
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useEPTheme.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/hooks/useEPTheme.ts src/hooks/useEPTheme.test.ts
git commit -m "feat: add useEPTheme hook for route-based theme resolution"
```

---

### Task 5: Rewrite App.tsx as Thin Orchestrator

**Files:**
- Modify: `src/App.tsx`

**Step 1: Rewrite App.tsx**

Replace entire contents of `src/App.tsx` with:

```typescript
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import { EP_THEMES, getEPIndex } from './data/eps'
import { StoryProgress } from './components/StoryProgress'
import { PlayerBar } from './components/PlayerBar'
import { EPPage } from './components/EPPage'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useCarousel } from './hooks/useCarousel'
import { useEPTheme } from './hooks/useEPTheme'

const slideVariants = {
  enter: (direction: string) => ({
    x: direction === 'right' ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: string) => ({
    x: direction === 'right' ? '-100%' : '100%',
  }),
}

const slideTransition = {
  type: 'tween',
  duration: 0.35,
  ease: 'easeInOut',
} as const

const epIds = new Set(EP_THEMES.map(ep => ep.id))

function App() {
  const navigate = useNavigate()
  const [currentTheme] = useEPTheme()
  const player = useAudioPlayer()
  const carousel = useCarousel(epIds, currentTheme.id, (nextId) => {
    player.pause()
    player.loadTrack(0)
    navigate(`/ep/${nextId}`)
  })

  useEffect(() => {
    player.setTracks(currentTheme.tracks)
  }, [currentTheme.id])

  const handleArtworkClick = () => {
    player.loadTrack(0, true)
    if (carousel.autoPlay) {
      carousel.toggleAutoPlay()
    }
  }

  return (
    <div className="app" data-theme={currentTheme.id}>
      <StoryProgress
        eps={EP_THEMES}
        currentEP={getEPIndex(currentTheme.id)}
        currentItemProgress={carousel.currentItemProgress}
      />

      <div className="nav-area prev" onClick={carousel.prev} />
      <div className="nav-area next" onClick={carousel.next} />

      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

      <div className="slide-container">
        <AnimatePresence initial={false} mode="popLayout" custom={carousel.direction}>
          <motion.div
            key={currentTheme.id}
            data-theme={currentTheme.id}
            custom={carousel.direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <EPPage theme={currentTheme} onArtworkClick={handleArtworkClick} />
          </motion.div>
        </AnimatePresence>
      </div>

      <PlayerBar
        trackNumber={player.currentTrack + 1}
        trackName={player.trackName}
        isPlaying={player.isPlaying}
        progress={player.progress}
        volume={player.volume}
        onTogglePlay={player.toggle}
        onNextTrack={player.nextTrack}
        onPrevTrack={player.prevTrack}
        onVolumeChange={player.setVolume}
        onSeek={player.seek}
      />

      <button
        className="bio-button"
        onClick={() => navigate('/bio', { state: { fromEP: currentTheme.id } })}
        title="About Pacific Ghost"
      >
        &#9432;
      </button>

      <button
        className={`auto-play-toggle ${!carousel.autoPlay ? 'paused' : ''}`}
        onClick={carousel.toggleAutoPlay}
        title={carousel.autoPlay ? 'Auto-advance enabled' : 'Auto-advance paused'}
      >
        <span className="toggle-icon">{carousel.autoPlay ? '⏸' : '▶'}</span>
        <span className="toggle-label">{carousel.autoPlay ? 'Auto' : 'Paused'}</span>
      </button>
    </div>
  )
}

export default App
```

**Step 2: Run full test suite**

Run: `npm test`
Expected: All existing tests pass (EPPage, StoryProgress, eps data tests unchanged)

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: rewrite App.tsx as thin orchestrator using hooks and services"
```

---

### Task 6: Simplify PlayerBar and BioPage

**Files:**
- Modify: `src/components/PlayerBar.tsx`
- Modify: `src/components/BioPage.tsx`
- Modify: `src/components/StoryProgress.tsx`

**Step 1: Simplify PlayerBar — remove forwardRef and audio element**

Replace entire contents of `src/components/PlayerBar.tsx` with:

```typescript
interface PlayerBarProps {
  trackNumber: number
  trackName: string
  isPlaying: boolean
  progress: number
  volume: number
  onTogglePlay: () => void
  onNextTrack: () => void
  onPrevTrack: () => void
  onVolumeChange: (volume: number) => void
  onSeek: (percent: number) => void
}

export function PlayerBar({
  trackNumber,
  trackName,
  isPlaying,
  progress,
  volume,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onVolumeChange,
  onSeek,
}: PlayerBarProps) {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = ((e.clientX - rect.left) / rect.width) * 100
    onSeek(Math.max(0, Math.min(100, percent)))
  }

  return (
    <div className="player-bar">
      <div className="player-controls">
        <button className="player-btn" onClick={onPrevTrack}>
          ⏮
        </button>
        <button className="player-btn" onClick={onTogglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="player-btn" onClick={onNextTrack}>
          ⏭
        </button>
      </div>

      <div className="track-info">
        <div className="track-name">
          {String(trackNumber).padStart(2, '0')} — {trackName}
        </div>
        <div className="track-progress" onClick={handleProgressClick}>
          <div className="track-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="volume-control">
        <span className="volume-icon">◈</span>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume}
          style={{ '--volume-pct': `${volume}%` } as React.CSSProperties}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
```

**Step 2: Update BioPage to use useEPTheme**

Replace entire contents of `src/components/BioPage.tsx` with:

```typescript
import { useLocation } from 'react-router-dom'
import { useEPTheme } from '../hooks/useEPTheme'

export function BioPage() {
  const location = useLocation()
  const fromEP = (location.state as { fromEP?: string } | null)?.fromEP
  const [theme, setTheme] = useEPTheme(fromEP)

  return (
    <div className="bio-page" data-theme={theme.id}>
      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

      <button className="bio-back" onClick={() => setTheme(theme.id)} title="Back">
        &larr;
      </button>

      <div className="bio-content">
        <h1 className="bio-heading">PACIFIC GHOST</h1>
        <p className="bio-text">
          Pacific Ghost is a Los Angeles-based band formed by Jeff Skelton, Dave Lentz, Jason
          Cottis, and Matt Eldredge. The band shares songwriting duties and creates cinematic music
          that blends indie rock, Americana, and surf guitar influences &mdash; drawing from artists
          like The National, War on Drugs, and Father John Misty. Perfect for late-night drives and
          moments of introspection, their songs capture both driving urgency and emotional depth.
        </p>
        <p className="bio-text">
          The members have been playing together for over ten years, initially performing as Grizzly
          Derringer, where they released four EPs before transitioning to Pacific Ghost. The long
          history together has created a deep musical chemistry and genuine friendship that continues
          to shape their collaborative approach to songwriting and performance.
        </p>
      </div>
    </div>
  )
}
```

**Step 3: Update StoryProgress prop name**

In `src/components/StoryProgress.tsx`, rename `storyProgress` prop to `currentItemProgress`. Update the interface and usage:

```typescript
interface StoryProgressProps {
  eps: EPTheme[]
  currentEP: number
  currentItemProgress: number
}

export function StoryProgress({ eps, currentEP, currentItemProgress }: StoryProgressProps) {
  return (
    <div className="story-progress">
      {eps.map((ep, index) => (
        <div key={ep.id} className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: index < currentEP ? '100%' : index === currentEP ? `${currentItemProgress}%` : '0%',
            }}
          />
        </div>
      ))}
    </div>
  )
}
```

**Step 4: Update StoryProgress tests**

In `src/components/StoryProgress.test.tsx`, replace all `storyProgress` prop references with `currentItemProgress`.

**Step 5: Run full test suite**

Run: `npm test`
Expected: All tests PASS

**Step 6: Commit**

```bash
git add src/components/PlayerBar.tsx src/components/BioPage.tsx src/components/StoryProgress.tsx src/components/StoryProgress.test.tsx
git commit -m "refactor: simplify PlayerBar, BioPage, and StoryProgress to pure presentation"
```

---

### Task 7: Remove autoPlay from root navigation

**Files:**
- Modify: `src/main.tsx`

**Step 1: Clean up root redirect**

The current root route passes `state: { fromRoot: true }` to trigger auto-play. With the new architecture, auto-play is managed entirely by the carousel hook. Remove the location state from the redirect.

In `src/main.tsx`, change:

```typescript
<Route path="/" element={<Navigate to="/ep/lovesickage" state={{ fromRoot: true }} replace />} />
```

to:

```typescript
<Route path="/" element={<Navigate to="/ep/lovesickage" replace />} />
```

**Step 2: Run full test suite and type check**

Run: `npm test && npx tsc --noEmit`
Expected: All tests PASS, no type errors

**Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "refactor: remove fromRoot location state, autoPlay managed by carousel hook"
```

---

### Task 8: Final Verification

**Step 1: Run full test suite**

Run: `npm test`
Expected: All tests PASS

**Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Run lint**

Run: `npm run lint`
Expected: No errors (fix any that arise)

**Step 4: Run dev server and manually verify**

Run: `npm run dev`

Manual checks:
- EP carousel slides left/right on click
- Auto-play toggle works, progress bar fills, auto-advances
- Audio plays on artwork click
- Play/pause, next/prev track, seek, volume all work
- Bio page loads with correct theme, back button works
- No console errors

**Step 5: Final commit if any fixes needed**
