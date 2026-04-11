import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { EP_THEMES } from './data/eps'
import { PlayerBar } from './components/PlayerBar'
import { EPPage } from './components/EPPage'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useActiveSection } from './hooks/useActiveSection'

const epIds = EP_THEMES.map((ep) => ep.id)

function App() {
  const navigate = useNavigate()
  const player = useAudioPlayer()
  const [menuOpen, setMenuOpen] = useState(false)

  const sectionRefs = useRef(
    EP_THEMES.map(() => ({ current: null as HTMLElement | null })),
  ).current

  const activeId = useActiveSection(epIds, sectionRefs)
  const activeTheme = EP_THEMES.find((ep) => ep.id === activeId) ?? EP_THEMES[0]

  const prevActiveId = useRef(activeId)

  useEffect(() => {
    if (activeId !== prevActiveId.current) {
      prevActiveId.current = activeId
      player.setTracks(activeTheme.tracks)
      player.loadTrack(0)
    }
  }, [activeId, activeTheme.tracks, player])

  // Load tracks for the initial EP on mount
  useEffect(() => {
    player.setTracks(activeTheme.tracks)
    player.loadTrack(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="app" data-theme={activeId}>
      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

      <header className="site-header">
        <span className="header-wordmark">Pacific Ghost</span>
        <button
          className="header-menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          <span className="header-menu-icon" />
        </button>
      </header>

      {menuOpen && (
        <nav className="header-menu" onClick={() => setMenuOpen(false)}>
          <div className="header-menu-panel">
            <button
              className="header-menu-link"
              onClick={() => navigate('/bio', { state: { fromEP: activeId } })}
            >
              About
            </button>
            <a className="header-menu-link" href="mailto:hello@pacificghost.fm">
              Contact
            </a>
          </div>
        </nav>
      )}

      <div className="ep-dots" aria-label="EP navigation">
        {EP_THEMES.map((ep) => (
          <div
            key={ep.id}
            className={`ep-dot${ep.id === activeId ? ' active' : ''}`}
          />
        ))}
      </div>

      <div className="scroll-container">
        {EP_THEMES.map((theme, index) => (
          <section
            key={theme.id}
            ref={(el) => {
              sectionRefs[index].current = el
            }}
            className="ep-section"
            data-theme={theme.id}
          >
            <EPPage theme={theme} />
          </section>
        ))}
      </div>

      <PlayerBar
        trackNumber={player.currentTrack + 1}
        trackName={player.trackName}
        isPlaying={player.isPlaying}
        progress={player.progress}
        volume={player.volume}
        onTogglePlay={player.toggle}
        onNextTrack={player.nextTrack}
        onPrevTrack={player.prevTrack}
        onVolumeChange={player.setVolume}
        onSeek={player.seek}
      />
    </div>
  )
}

export default App
