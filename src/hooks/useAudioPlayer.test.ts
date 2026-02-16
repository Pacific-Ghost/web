import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudioPlayer } from './useAudioPlayer'
import { audioPlayer } from '../services/AudioPlayer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCallback = (...args: any[]) => void

vi.mock('../services/AudioPlayer', () => {
  const callbacks: Record<string, AnyCallback> = {}
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
      onPlaybackChange: vi.fn((cb: AnyCallback) => { callbacks.playback = cb }),
      onProgressChange: vi.fn((cb: AnyCallback) => { callbacks.progress = cb }),
      onTrackChange: vi.fn((cb: AnyCallback) => { callbacks.track = cb }),
      onVolumeChange: vi.fn((cb: AnyCallback) => { callbacks.volume = cb }),
      onTrackEnded: vi.fn((cb: AnyCallback) => { callbacks.ended = cb }),
      _callbacks: callbacks,
    },
  }
})

const mock = audioPlayer as unknown as typeof audioPlayer & { _callbacks: Record<string, AnyCallback> }

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

  it('deregisters all event listeners on unmount', () => {
    const { unmount } = renderHook(() => useAudioPlayer())
    unmount()
    expect(audioPlayer.onPlaybackChange).toHaveBeenCalledTimes(2)
    expect(audioPlayer.onProgressChange).toHaveBeenCalledTimes(2)
    expect(audioPlayer.onTrackChange).toHaveBeenCalledTimes(2)
    expect(audioPlayer.onVolumeChange).toHaveBeenCalledTimes(2)
    expect(audioPlayer.onTrackEnded).toHaveBeenCalledTimes(2)
  })

  it('calls nextTrack when track ends', () => {
    renderHook(() => useAudioPlayer())
    act(() => { mock._callbacks.ended() })
    expect(audioPlayer.nextTrack).toHaveBeenCalled()
  })
})
