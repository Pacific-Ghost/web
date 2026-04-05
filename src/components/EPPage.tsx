import { useState } from 'react'
import { EPTheme } from '../data/eps'
import { StreamingOverlay } from './StreamingOverlay'

interface EPPageProps {
  theme: EPTheme
}

function buildStreamingLinks(links: EPTheme['links']) {
  if (!links) return []
  const result: { platform: 'spotify' | 'appleMusic' | 'bandcamp'; url: string }[] = []
  if (links.spotify) result.push({ platform: 'spotify', url: links.spotify })
  if (links.appleMusic) result.push({ platform: 'appleMusic', url: links.appleMusic })
  if (links.bandcamp) result.push({ platform: 'bandcamp', url: links.bandcamp })
  return result
}

export function EPPage({ theme }: EPPageProps) {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const streamingLinks = buildStreamingLinks(theme.links)
  const hasLinks = streamingLinks.length > 0
  const isAvailable = theme.statusType === 'available' && hasLinks

  return (
    <div className="site-content">
      <div
        className="artwork-container"
        onClick={isAvailable ? () => setOverlayOpen(true) : undefined}
        style={isAvailable ? { cursor: 'pointer' } : undefined}
      >
        <div className="artwork-glow-outer" />
        <div className="artwork-frame">
          {theme.artwork ? (
            <picture>
              <source srcSet={theme.artwork.webp} type="image/webp" />
              <img
                className="artwork-img"
                src={theme.artwork.jpg}
                alt={theme.artwork.alt}
                title={
                  theme.artwork.credit
                    ? `Artwork ${theme.artwork.credit}`
                    : undefined
                }
                width={800}
                height={800}
                loading="eager"
              />
            </picture>
          ) : (
            <div className="artwork-image">
              <div className="artwork-pattern" />
              <div className="artwork-icon">{theme.icon}</div>
            </div>
          )}
          {isAvailable && (
            <div className="artwork-cta">
              <span className="artwork-cta-text">Stream Now</span>
            </div>
          )}
        </div>
        {theme.artwork?.credit && (
          <div className="artwork-credit">Artwork {theme.artwork.credit}</div>
        )}
      </div>

      <div className="ep-info">
        {theme.statusType === 'coming' && (
          <div className={`ep-status ${theme.statusType}`}>{theme.status}</div>
        )}
        <p className="ep-description">
          {theme.description.map((line, i) => (
            <span key={i}>
              {line}
              {i < theme.description.length - 1 && <br />}
            </span>
          ))}
        </p>

        {theme.statusType === 'coming' && theme.links?.spotify && (
          <div className="links">
            <a
              href={theme.links.spotify}
              className="link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="link-icon">►</span>
              <span>Follow</span>
            </a>
          </div>
        )}
      </div>

      {overlayOpen && hasLinks && (
        <StreamingOverlay
          links={streamingLinks}
          epName={theme.name}
          onClose={() => setOverlayOpen(false)}
        />
      )}
    </div>
  )
}
