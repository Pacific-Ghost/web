export type Track = { id: number; name: string; file: string }

type PlaybackChangeCallback = (isPlaying: boolean) => void
type ProgressChangeCallback = (progress: number) => void
type TrackChangeCallback = (index: number, name: string) => void
type VolumeChangeCallback = (volume: number) => void
type TrackEndedCallback = () => void

export interface AudioPlayer {
  play(): void
  pause(): void
  toggle(): void
  seek(percent: number): void
  setVolume(volume: number): void
  setTracks(tracks: Track[]): void
  loadTrack(index: number, autoPlay?: boolean): void
  nextTrack(): void
  prevTrack(): void
  onPlaybackChange(cb: PlaybackChangeCallback | null): void
  onProgressChange(cb: ProgressChangeCallback | null): void
  onTrackChange(cb: TrackChangeCallback | null): void
  onVolumeChange(cb: VolumeChangeCallback | null): void
  onTrackEnded(cb: TrackEndedCallback | null): void
}

export class HTMLAudioPlayerService implements AudioPlayer {
  private audio: HTMLAudioElement
  private tracks: Track[] = []
  private currentTrackIndex = 0
  private playing = false

  private playbackChangeCallback: PlaybackChangeCallback | null = null
  private progressChangeCallback: ProgressChangeCallback | null = null
  private trackChangeCallback: TrackChangeCallback | null = null
  private volumeChangeCallback: VolumeChangeCallback | null = null
  private trackEndedCallback: TrackEndedCallback | null = null

  constructor() {
    this.audio = new Audio()
    this.audio.volume = 1
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
    this.audio.addEventListener('ended', this.handleEnded)
  }

  play(): void {
    this.audio
      .play()
      .then(() => {
        this.playing = true
        this.playbackChangeCallback?.(true)
      })
      .catch(() => {
        this.playing = false
        this.playbackChangeCallback?.(false)
      })
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

  setTracks(tracks: Track[]): void {
    this.tracks = tracks
  }

  loadTrack(index: number, autoPlay = false): void {
    const track = this.tracks[index]
    if (!track) return

    const alreadyLoaded =
      this.audio.src === track.file && this.currentTrackIndex === index
    if (alreadyLoaded) {
      this.trackChangeCallback?.(index, track.name)
      if (autoPlay && !this.playing) {
        this.play()
      }
      return
    }

    this.currentTrackIndex = index
    this.audio.src = track.file
    this.audio.load()
    this.progressChangeCallback?.(0)
    this.trackChangeCallback?.(index, track.name)
    if (autoPlay) {
      this.play()
    }
  }

  nextTrack(): void {
    if (this.tracks.length === 0) return
    const next = (this.currentTrackIndex + 1) % this.tracks.length
    this.loadTrack(next, this.playing)
  }

  prevTrack(): void {
    if (this.tracks.length === 0) return
    const prev =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length
    this.loadTrack(prev, this.playing)
  }

  onPlaybackChange(cb: PlaybackChangeCallback | null): void {
    this.playbackChangeCallback = cb
  }

  onProgressChange(cb: ProgressChangeCallback | null): void {
    this.progressChangeCallback = cb
  }

  onTrackChange(cb: TrackChangeCallback | null): void {
    this.trackChangeCallback = cb
  }

  onVolumeChange(cb: VolumeChangeCallback | null): void {
    this.volumeChangeCallback = cb
  }

  onTrackEnded(cb: TrackEndedCallback | null): void {
    this.trackEndedCallback = cb
  }

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

export const audioPlayer: AudioPlayer = new HTMLAudioPlayerService()
