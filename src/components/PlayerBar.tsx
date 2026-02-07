import { forwardRef } from 'react'

interface PlayerBarProps {
  trackNumber: number
  trackName: string
  trackFile: string
  isPlaying: boolean
  progress: number
  volume: number
  onTogglePlay: () => void
  onNextTrack: () => void
  onPrevTrack: () => void
  onVolumeChange: (volume: number) => void
}

export const PlayerBar = forwardRef<HTMLAudioElement, PlayerBarProps>(
  (
    {
      trackNumber,
      trackName,
      trackFile,
      isPlaying,
      progress,
      volume,
      onTogglePlay,
      onNextTrack,
      onPrevTrack,
      onVolumeChange,
    },
    ref,
  ) => {
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
          <div className="track-progress">
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
            onChange={(e) => onVolumeChange(Number(e.target.value))}
          />
        </div>

        <audio ref={ref} src={trackFile} />
      </div>
    )
  },
)
