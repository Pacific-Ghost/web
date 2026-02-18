import { useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { EP_THEMES, getEPIndex } from './data/eps'
import { StoryProgress } from './components/StoryProgress'
import { PlayerBar } from './components/PlayerBar'
import { EPPage } from './components/EPPage'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useCarousel } from './hooks/useCarousel'
import { useEPTheme } from './hooks/useEPTheme'

const epIds = new Set(EP_THEMES.map((ep) => ep.id))

function App() {
  const navigate = useNavigate()
  const [currentTheme] = useEPTheme()
  const player = useAudioPlayer()

  const currentIndex = EP_THEMES.findIndex((ep) => ep.id === currentTheme.id)
  const prevTheme =
    EP_THEMES[(currentIndex - 1 + EP_THEMES.length) % EP_THEMES.length]
  const nextTheme = EP_THEMES[(currentIndex + 1) % EP_THEMES.length]

  const stripRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const isResettingRef = useRef(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartTime = useRef<number | null>(null)

  // After navigate() triggers a re-render, useLayoutEffect fires synchronously
  // after React commits the new slot themes but before the browser paints.
  // This guarantees the strip position reset and the new content land in the same frame.
  useLayoutEffect(() => {
    if (!isResettingRef.current) return
    const strip = stripRef.current
    if (strip) {
      strip.style.transform = 'translateX(calc(-100vw))'
    }
    isResettingRef.current = false
    isAnimatingRef.current = false
  }, [currentTheme.id])

  // Animate the strip to the target position, then navigate and reset.
  // Used by both swipe commits and programmatic navigation (auto-advance, clicks).
  const animateAndNavigate = useCallback(
    (nextId: string, targetX: string) => {
      const strip = stripRef.current
      if (!strip) {
        navigate(`/ep/${nextId}`)
        return
      }

      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'transform') return
        strip.removeEventListener('transitionend', onEnd)
        strip.style.transition = 'none'
        // Signal useLayoutEffect to reset the strip after React re-renders.
        // isAnimatingRef stays true until the layout effect clears it.
        isResettingRef.current = true
        navigate(`/ep/${nextId}`)
      }
      strip.addEventListener('transitionend', onEnd)
      strip.style.transform = targetX
    },
    [navigate],
  )

  // Called by useCarousel for programmatic navigation (auto-advance, nav-area clicks).
  const performNavigate = useCallback(
    (nextId: string) => {
      player.pause()
      const strip = stripRef.current
      if (!strip || isAnimatingRef.current) {
        navigate(`/ep/${nextId}`)
        return
      }

      const nextIdx = EP_THEMES.findIndex((ep) => ep.id === nextId)
      const isNext = nextIdx === (currentIndex + 1) % EP_THEMES.length
      const targetX = isNext
        ? 'translateX(calc(-200vw))'
        : 'translateX(0vw)'

      isAnimatingRef.current = true
      strip.style.transition = 'transform 0.35s ease-in-out'
      animateAndNavigate(nextId, targetX)
    },
    [player, navigate, currentIndex, animateAndNavigate],
  )

  const carousel = useCarousel(epIds, currentTheme.id, performNavigate)

  useEffect(() => {
    player.setTracks(currentTheme.tracks)
    player.loadTrack(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme.id])

  useEffect(() => {
    if (player.isPlaying && carousel.autoPlay) {
      carousel.toggleAutoPlay()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.isPlaying])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimatingRef.current) return
    touchStartX.current = e.touches[0].clientX
    touchStartTime.current = Date.now()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.touches[0].clientX - touchStartX.current
    const strip = stripRef.current
    if (strip) {
      strip.style.transition = 'none'
      strip.style.transform = `translateX(calc(-100vw + ${delta}px))`
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartTime.current === null) return
    const endX = e.changedTouches[0].clientX
    const delta = endX - touchStartX.current
    const elapsed = Math.max(1, Date.now() - touchStartTime.current)
    const velocity = delta / elapsed // px/ms
    touchStartX.current = null
    touchStartTime.current = null

    const strip = stripRef.current
    if (!strip) return

    const isNext = delta < -60 || velocity < -0.3
    const isPrev = delta > 60 || velocity > 0.3

    if (isNext || isPrev) {
      player.pause()
      isAnimatingRef.current = true
      const nextId = isNext ? nextTheme.id : prevTheme.id
      const targetX = isNext
        ? 'translateX(calc(-200vw))'
        : 'translateX(0vw)'
      strip.style.transition = 'transform 0.25s ease-out'
      animateAndNavigate(nextId, targetX)
    } else {
      // Snap back to center
      strip.style.transition =
        'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      strip.style.transform = 'translateX(calc(-100vw))'
      const cleanup = (e: TransitionEvent) => {
        if (e.propertyName !== 'transform') return
        strip.style.transition = ''
        strip.removeEventListener('transitionend', cleanup)
      }
      strip.addEventListener('transitionend', cleanup)
    }
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
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={stripRef} className="slide-strip">
          <div className="slide-slot" data-theme={prevTheme.id}>
            <EPPage theme={prevTheme} onArtworkClick={handleArtworkClick} />
          </div>
          <div className="slide-slot" data-theme={currentTheme.id}>
            <EPPage theme={currentTheme} onArtworkClick={handleArtworkClick} />
          </div>
          <div className="slide-slot" data-theme={nextTheme.id}>
            <EPPage theme={nextTheme} onArtworkClick={handleArtworkClick} />
          </div>
        </div>
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
