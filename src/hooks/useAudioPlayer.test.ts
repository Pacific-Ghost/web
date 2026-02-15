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
