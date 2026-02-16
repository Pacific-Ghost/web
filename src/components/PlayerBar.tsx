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

function PrevIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="0" y="1" width="2.5" height="12" />
      <polygon points="13,1 13,13 3.5,7" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <polygon points="2,0 2,14 13,7" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="1.5" y="1" width="3.5" height="12" />
      <rect x="9" y="1" width="3.5" height="12" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <polygon points="1,1 1,13 10.5,7" />
      <rect x="11.5" y="1" width="2.5" height="12" />
    </svg>
  )
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
          <PrevIcon />
        </button>
        <button className="player-btn" onClick={onTogglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="player-btn" onClick={onNextTrack}>
          <NextIcon />
        </button>
      </div>

      <div className="track-info">
        <div className="track-name">
          {String(trackNumber).padStart(2, '0')} — {trackName}
        </div>
        <div className="track-progress" onClick={handleProgressClick}>
          <div
            className="track-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="volume-control">
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
