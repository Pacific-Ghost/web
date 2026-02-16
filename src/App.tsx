import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import { EP_THEMES, getEPIndex } from './data/eps'
import { StoryProgress } from './components/StoryProgress'
import { PlayerBar } from './components/PlayerBar'
import { EPPage } from './components/EPPage'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useCarousel } from './hooks/useCarousel'
import { useEPTheme } from './hooks/useEPTheme'

const slideVariants = {
  enter: (direction: string) => ({
    x: direction === 'right' ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: string) => ({
    x: direction === 'right' ? '-100%' : '100%',
  }),
}

const slideTransition = {
  type: 'tween',
  duration: 0.35,
  ease: 'easeInOut',
} as const

const epIds = new Set(EP_THEMES.map((ep) => ep.id))

function App() {
  const navigate = useNavigate()
  const [currentTheme] = useEPTheme()
  const player = useAudioPlayer()
  const carousel = useCarousel(epIds, currentTheme.id, (nextId) => {
    player.pause()
    navigate(`/ep/${nextId}`)
  })

  // Sync tracks when EP changes — player/tracks are derived from currentTheme.id
  useEffect(() => {
    player.setTracks(currentTheme.tracks)
    player.loadTrack(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme.id])

  // Disable auto-advance when audio starts playing
  useEffect(() => {
    if (player.isPlaying && carousel.autoPlay) {
      carousel.toggleAutoPlay()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.isPlaying])

  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -60) carousel.next()
    else if (delta > 60) carousel.prev()
  }

  const handleArtworkClick = () => {
    player.loadTrack(0, true)
    if (carousel.autoPlay) {
      carousel.toggleAutoPlay()
    }
  }

  return (
    <div className="app" data-theme={currentTheme.id}>
      <StoryProgress
        eps={EP_THEMES}
        currentEP={getEPIndex(currentTheme.id)}
        currentItemProgress={carousel.currentItemProgress}
      />

      <div className="nav-area prev" onClick={carousel.prev} />
      <div className="nav-area next" onClick={carousel.next} />

      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

      <div
        className="slide-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence
          initial={false}
          mode="popLayout"
          custom={carousel.direction}
        >
          <motion.div
            key={currentTheme.id}
            data-theme={currentTheme.id}
            custom={carousel.direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <EPPage theme={currentTheme} onArtworkClick={handleArtworkClick} />
          </motion.div>
        </AnimatePresence>
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
        onBioClick={() => navigate('/bio', { state: { fromEP: currentTheme.id } })}
        autoPlay={carousel.autoPlay}
        onToggleAutoPlay={carousel.toggleAutoPlay}
        autoPlayDisabled={player.isPlaying}
      />

      <button
        className="bio-button"
        onClick={() => navigate('/bio', { state: { fromEP: currentTheme.id } })}
        title="About Pacific Ghost"
      >
        &#9432;
      </button>

      <button
        disabled={player.isPlaying}
        className={`auto-play-toggle ${!carousel.autoPlay ? 'paused' : ''}`}
        onClick={carousel.toggleAutoPlay}
        title={
          carousel.autoPlay ? 'Auto-advance enabled' : 'Auto-advance paused'
        }
      >
        <span className="toggle-icon">{carousel.autoPlay ? '‖' : '►'}</span>
        <span className="toggle-label">
          {carousel.autoPlay ? 'Auto' : 'Paused'}
        </span>
      </button>
    </div>
  )
}

export default App
