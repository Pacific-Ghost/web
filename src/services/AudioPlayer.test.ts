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
  } as unknown as HTMLAudioElement & { _listeners: Record<string, Function[]>; _fireEvent: (name: string) => void; duration: number }
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

    it('resets progress to 0 on load', () => {
      const cb = vi.fn()
      player.onProgressChange(cb)
      player.loadTrack(1)
      expect(cb).toHaveBeenCalledWith(0)
    })
  })

  describe('play/pause/toggle', () => {
    it('play calls audio.play and fires onPlaybackChange on success', async () => {
      const cb = vi.fn()
      player.onPlaybackChange(cb)
      player.play()
      await vi.waitFor(() => expect(cb).toHaveBeenCalledWith(true))
      expect(mockAudio.play).toHaveBeenCalled()
    })

    it('play fires onPlaybackChange(false) when autoplay is blocked', async () => {
      mockAudio.play = vi.fn().mockRejectedValue(new Error('autoplay blocked'))
      const cb = vi.fn()
      player.onPlaybackChange(cb)
      player.play()
      await vi.waitFor(() => expect(cb).toHaveBeenCalledWith(false))
    })

    it('pause calls audio.pause and fires onPlaybackChange', () => {
      const cb = vi.fn()
      player.onPlaybackChange(cb)
      player.pause()
      expect(mockAudio.pause).toHaveBeenCalled()
      expect(cb).toHaveBeenCalledWith(false)
    })

    it('toggle alternates between play and pause', async () => {
      const cb = vi.fn()
      player.onPlaybackChange(cb)
      player.toggle() // should play
      await vi.waitFor(() => expect(cb).toHaveBeenCalledWith(true))
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
