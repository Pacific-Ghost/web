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
