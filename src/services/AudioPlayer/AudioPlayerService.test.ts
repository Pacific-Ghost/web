import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { HTMLAudioPlayerService } from './AudioPlayerService'

function createMockAudio() {
  const listeners: Record<string, Array<() => void>> = {}
  return {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    load: vi.fn(),
    addEventListener: vi.fn((event: string, cb: () => void) => {
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
      ;(listeners[name] || []).forEach((cb) => cb())
    },
  } as unknown as HTMLAudioElement & {
    _listeners: Record<string, Array<() => void>>
    _fireEvent: (name: string) => void
    duration: number
  }
}

describe('AudioPlayer', () => {
  const ctx = {} as {
    player: HTMLAudioPlayerService
    mockAudio: ReturnType<typeof createMockAudio>
  }

  beforeEach(() => {
    ctx.mockAudio = createMockAudio()
    vi.stubGlobal(
      'Audio',
      vi.fn(() => ctx.mockAudio),
    )
    ctx.player = new HTMLAudioPlayerService()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('constructor', () => {
    it('sets volume to full by default', () => {
      expect(ctx.mockAudio.volume).toBe(1)
    })

    it('registers timeupdate and ended listeners', () => {
      expect(ctx.mockAudio.addEventListener).toHaveBeenCalledWith(
        'timeupdate',
        expect.any(Function),
      )
      expect(ctx.mockAudio.addEventListener).toHaveBeenCalledWith(
        'ended',
        expect.any(Function),
      )
    })
  })

  describe('setTracks', () => {
    it('stores tracks for later use', () => {
      const tracks = [
        { id: 1, name: 'Track 1', file: '/audio/track1.mp3' },
        { id: 2, name: 'Track 2', file: '/audio/track2.mp3' },
      ]
      ctx.player.setTracks(tracks)
      ctx.player.loadTrack(0)
      expect(ctx.mockAudio.src).toBe('/audio/track1.mp3')
    })
  })

  describe('loadTrack', () => {
    const tracks = [
      { id: 1, name: 'Track 1', file: '/audio/track1.mp3' },
      { id: 2, name: 'Track 2', file: '/audio/track2.mp3' },
    ]

    beforeEach(() => {
      ctx.player.setTracks(tracks)
    })

    it('sets audio src and calls load', () => {
      ctx.player.loadTrack(1)
      expect(ctx.mockAudio.src).toBe('/audio/track2.mp3')
      expect(ctx.mockAudio.load).toHaveBeenCalled()
    })

    it('fires onTrackChange callback', () => {
      const cb = vi.fn()
      ctx.player.onTrackChange(cb)
      ctx.player.loadTrack(1)
      expect(cb).toHaveBeenCalledWith(1, 'Track 2')
    })

    it('auto-plays when autoPlay is true', () => {
      ctx.player.loadTrack(0, true)
      expect(ctx.mockAudio.play).toHaveBeenCalled()
    })

    it('does not auto-play by default', () => {
      ctx.player.loadTrack(0)
      expect(ctx.mockAudio.play).not.toHaveBeenCalled()
    })

    it('skips reload if same track is already loaded', () => {
      ctx.player.loadTrack(0)
      const loadSpy = vi.fn()
      ctx.mockAudio.load = loadSpy
      ctx.player.loadTrack(0)
      expect(loadSpy).not.toHaveBeenCalled()
    })

    it('still fires trackChange when skipping reload', () => {
      ctx.player.loadTrack(0)
      const cb = vi.fn()
      ctx.player.onTrackChange(cb)
      ctx.player.loadTrack(0)
      expect(cb).toHaveBeenCalledWith(0, 'Track 1')
    })

    it('resets progress to 0 on load', () => {
      const cb = vi.fn()
      ctx.player.onProgressChange(cb)
      ctx.player.loadTrack(1)
      expect(cb).toHaveBeenCalledWith(0)
    })
  })

  describe('play/pause/toggle', () => {
    it('play calls audio.play and fires onPlaybackChange on success', async () => {
      const cb = vi.fn()
      ctx.player.onPlaybackChange(cb)
      ctx.player.play()
      await vi.waitFor(() => expect(cb).toHaveBeenCalledWith(true))
      expect(ctx.mockAudio.play).toHaveBeenCalled()
    })

    it('play fires onPlaybackChange(false) when autoplay is blocked', async () => {
      ctx.mockAudio.play = vi
        .fn()
        .mockRejectedValue(new Error('autoplay blocked'))
      const cb = vi.fn()
      ctx.player.onPlaybackChange(cb)
      ctx.player.play()
      await vi.waitFor(() => expect(cb).toHaveBeenCalledWith(false))
    })

    it('pause calls audio.pause and fires onPlaybackChange', () => {
      const cb = vi.fn()
      ctx.player.onPlaybackChange(cb)
      ctx.player.pause()
      expect(ctx.mockAudio.pause).toHaveBeenCalled()
      expect(cb).toHaveBeenCalledWith(false)
    })

    it('toggle alternates between play and pause', async () => {
      const cb = vi.fn()
      ctx.player.onPlaybackChange(cb)
      ctx.player.toggle() // should play
      await vi.waitFor(() => expect(cb).toHaveBeenCalledWith(true))
      ctx.player.toggle() // should pause
      expect(cb).toHaveBeenCalledWith(false)
    })
  })

  describe('seek', () => {
    it('sets currentTime based on percent', () => {
      ctx.mockAudio.duration = 200
      ctx.player.seek(50)
      expect(ctx.mockAudio.currentTime).toBe(100)
    })
  })

  describe('getVolume', () => {
    it('returns current volume as 0-100 integer', () => {
      expect(ctx.player.getVolume()).toBe(100)
      ctx.player.setVolume(30)
      expect(ctx.player.getVolume()).toBe(30)
    })
  })

  describe('setVolume', () => {
    it('sets audio volume and fires onVolumeChange', () => {
      const cb = vi.fn()
      ctx.player.onVolumeChange(cb)
      ctx.player.setVolume(30)
      expect(ctx.mockAudio.volume).toBe(0.3)
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
      ctx.player.setTracks(tracks)
      ctx.player.loadTrack(0)
    })

    it('nextTrack advances and wraps', () => {
      const cb = vi.fn()
      ctx.player.onTrackChange(cb)
      ctx.player.nextTrack()
      expect(cb).toHaveBeenCalledWith(1, 'B')
      ctx.player.nextTrack()
      expect(cb).toHaveBeenCalledWith(2, 'C')
      ctx.player.nextTrack()
      expect(cb).toHaveBeenCalledWith(0, 'A') // wraps
    })

    it('prevTrack goes back and wraps', () => {
      const cb = vi.fn()
      ctx.player.onTrackChange(cb)
      ctx.player.prevTrack()
      expect(cb).toHaveBeenCalledWith(2, 'C') // wraps to end
    })
  })

  describe('onProgressChange', () => {
    it('fires on audio timeupdate', () => {
      const cb = vi.fn()
      ctx.player.onProgressChange(cb)
      ctx.mockAudio.currentTime = 25
      ctx.mockAudio.duration = 100
      ctx.mockAudio._fireEvent('timeupdate')
      expect(cb).toHaveBeenCalledWith(25)
    })
  })

  describe('onTrackEnded', () => {
    it('fires on audio ended event', () => {
      const cb = vi.fn()
      ctx.player.onTrackEnded(cb)
      ctx.mockAudio._fireEvent('ended')
      expect(cb).toHaveBeenCalled()
    })
  })
})
