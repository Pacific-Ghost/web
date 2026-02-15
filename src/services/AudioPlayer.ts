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

  play(): void {
    this.audio.play().then(() => {
      this.playing = true
      this.playbackChangeCallback?.(true)
    }).catch(() => {
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
