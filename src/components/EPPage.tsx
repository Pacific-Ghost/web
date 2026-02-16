import { EPTheme } from '../data/eps'
import { HeartbeatTitle } from './HeartbeatTitle'

interface EPPageProps {
  theme: EPTheme
  onArtworkClick: () => void
}

export function EPPage({ theme, onArtworkClick }: EPPageProps) {
  return (
    <div className="site-content">
      <div
        className="artwork-container"
        onClick={onArtworkClick}
        style={{ cursor: 'pointer' }}
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
        </div>
        {theme.artwork?.credit && (
          <div className="artwork-credit">Artwork {theme.artwork.credit}</div>
        )}
      </div>

      <div className="ep-info">
        <div className="ep-subtitle">PACIFIC GHOST</div>
        {theme.id === 'lovesickage' ? (
          <HeartbeatTitle text={theme.name} />
        ) : (
          <h1 className="ep-title">{theme.name}</h1>
        )}
        <div className={`ep-status ${theme.statusType}`}>{theme.status}</div>
        <p className="ep-description">
          {theme.description.map((line, i) => (
            <span key={i}>
              {line}
              {i < theme.description.length - 1 && <br />}
            </span>
          ))}
        </p>
        <div className="links">
          {theme.statusType === 'coming' ? null : (
            <>
              {theme.links?.spotify && (
                <a
                  href={theme.links.spotify}
                  className="link-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="link-icon">►</span>
                  <span>Spotify</span>
                </a>
              )}
              {theme.links?.appleMusic && (
                <a
                  href={theme.links.appleMusic}
                  className="link-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="link-icon">♪</span>
                  <span>Apple Music</span>
                </a>
              )}
              {theme.links?.bandcamp && (
                <a
                  href={theme.links.bandcamp}
                  className="link-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="link-icon">◆</span>
                  <span>Bandcamp</span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
