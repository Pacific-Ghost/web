import { useEffect, useCallback } from 'react'
import { SpotifyIcon, AppleMusicIcon, BandcampIcon } from './StreamingIcons'

interface StreamingLink {
  platform: 'spotify' | 'appleMusic' | 'bandcamp'
  url: string
}

interface StreamingOverlayProps {
  links: StreamingLink[]
  epName: string
  onClose: () => void
}

const platformConfig = {
  spotify: { label: 'Spotify', Icon: SpotifyIcon },
  appleMusic: { label: 'Apple Music', Icon: AppleMusicIcon },
  bandcamp: { label: 'Bandcamp', Icon: BandcampIcon },
} as const

export function StreamingOverlay({
  links,
  epName,
  onClose,
}: StreamingOverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="streaming-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-label={`Listen to ${epName}`}
    >
      <div className="streaming-panel">
        <div className="streaming-header">
          <span className="streaming-label">Listen to</span>
          <span className="streaming-ep-name">{epName}</span>
        </div>

        <div className="streaming-links">
          {links.map(({ platform, url }) => {
            const { label, Icon } = platformConfig[platform]
            return (
              <a
                key={platform}
                href={url}
                className="streaming-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={24} />
                <span>{label}</span>
              </a>
            )
          })}
        </div>

        <button className="streaming-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
