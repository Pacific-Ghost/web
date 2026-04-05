import { useEffect, useRef, useCallback } from 'react'
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

  const handleArtworkClick = useCallback(() => {
    player.loadTrack(0, true)
  }, [player])

  return (
    <div className="app" data-theme={activeId}>
      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

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
            <EPPage theme={theme} onArtworkClick={handleArtworkClick} />
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
        onBioClick={() =>
          navigate('/bio', { state: { fromEP: activeId } })
        }
        autoPlay={false}
        onToggleAutoPlay={() => {}}
        autoPlayDisabled={true}
      />

      <button
        className="bio-button"
        onClick={() =>
          navigate('/bio', { state: { fromEP: activeId } })
        }
        title="About Pacific Ghost"
      >
        &#9432;
      </button>
    </div>
  )
}

export default App
