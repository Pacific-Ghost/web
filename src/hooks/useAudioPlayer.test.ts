import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useAudioPlayer } from './useAudioPlayer'
import { mockAudioPlayer, renderHookWithProviders } from '../test-utils'
import type { AudioPlayer } from '../services/AudioPlayer/AudioPlayerService'

type TrackedCallbacks = {
  playback: (isPlaying: boolean) => void
  progress: (progress: number) => void
  track: (index: number, name: string) => void
  volume: (volume: number) => void
  ended: () => void
}

function createTrackedMock() {
  const callbacks = {} as TrackedCallbacks
  const player = mockAudioPlayer({
    onPlaybackChange: vi.fn((cb: ((v: boolean) => void) | null) => {
      if (cb) callbacks.playback = cb
    }),
    onProgressChange: vi.fn((cb: ((v: number) => void) | null) => {
      if (cb) callbacks.progress = cb
    }),
    onTrackChange: vi.fn((cb: ((i: number, n: string) => void) | null) => {
      if (cb) callbacks.track = cb
    }),
    onVolumeChange: vi.fn((cb: ((v: number) => void) | null) => {
      if (cb) callbacks.volume = cb
    }),
    onTrackEnded: vi.fn((cb: (() => void) | null) => {
      if (cb) callbacks.ended = cb
    }),
  } satisfies Partial<AudioPlayer>)
  return { player, callbacks }
}

describe('useAudioPlayer', () => {
  let player: AudioPlayer
  let callbacks: TrackedCallbacks

  beforeEach(() => {
    const tracked = createTrackedMock()
    player = tracked.player
    callbacks = tracked.callbacks
  })

  function renderHookWithPlayer() {
    return renderHookWithProviders(() => useAudioPlayer(), {
      services: { audioPlayer: player },
    })
  }

  it('registers all event listeners on mount', () => {
    renderHookWithPlayer()
    expect(player.onPlaybackChange).toHaveBeenCalled()
    expect(player.onProgressChange).toHaveBeenCalled()
    expect(player.onTrackChange).toHaveBeenCalled()
    expect(player.onVolumeChange).toHaveBeenCalled()
    expect(player.onTrackEnded).toHaveBeenCalled()
  })

  it('returns initial state', () => {
    const { result } = renderHookWithPlayer()
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.progress).toBe(0)
    expect(result.current.volume).toBe(70)
    expect(result.current.currentTrack).toBe(0)
    expect(result.current.trackName).toBe('')
  })

  it('updates isPlaying when onPlaybackChange fires', () => {
    const { result } = renderHookWithPlayer()
    act(() => {
      callbacks.playback(true)
    })
    expect(result.current.isPlaying).toBe(true)
  })

  it('updates progress when onProgressChange fires', () => {
    const { result } = renderHookWithPlayer()
    act(() => {
      callbacks.progress(42.5)
    })
    expect(result.current.progress).toBe(42.5)
  })

  it('updates track info when onTrackChange fires', () => {
    const { result } = renderHookWithPlayer()
    act(() => {
      callbacks.track(2, 'Ambulance')
    })
    expect(result.current.currentTrack).toBe(2)
    expect(result.current.trackName).toBe('Ambulance')
  })

  it('updates volume when onVolumeChange fires', () => {
    const { result } = renderHookWithPlayer()
    act(() => {
      callbacks.volume(30)
    })
    expect(result.current.volume).toBe(30)
  })

  it('passes through service methods', () => {
    const { result } = renderHookWithPlayer()
    result.current.toggle()
    expect(player.toggle).toHaveBeenCalled()
    result.current.seek(50)
    expect(player.seek).toHaveBeenCalledWith(50)
    result.current.setVolume(80)
    expect(player.setVolume).toHaveBeenCalledWith(80)
  })

  it('deregisters all event listeners on unmount', () => {
    const { unmount } = renderHookWithPlayer()
    unmount()
    expect(player.onPlaybackChange).toHaveBeenCalledTimes(2)
    expect(player.onProgressChange).toHaveBeenCalledTimes(2)
    expect(player.onTrackChange).toHaveBeenCalledTimes(2)
    expect(player.onVolumeChange).toHaveBeenCalledTimes(2)
    expect(player.onTrackEnded).toHaveBeenCalledTimes(2)
  })

  it('calls nextTrack when track ends', () => {
    renderHookWithPlayer()
    act(() => {
      callbacks.ended()
    })
    expect(player.nextTrack).toHaveBeenCalled()
  })
})
