import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import { EP_THEMES, getEPIndex, getEPById, getNextEPId, getPrevEPId } from './data/eps'
import { StoryProgress } from './components/StoryProgress'
import { PlayerBar } from './components/PlayerBar'
import { EPPage } from './components/EPPage'

const SLIDE_DURATION = 10000 // 10 seconds

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
  }),
}

const slideTransition = {
  type: 'tween',
  duration: 0.35,
  ease: 'easeInOut',
} as const

function App() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const epId = id ?? EP_THEMES[0].id
  const currentEPIndex = getEPIndex(epId)
  const currentTheme = getEPById(epId)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const [volume, setVolume] = useState(70)
  const [autoPlay, setAutoPlay] = useState(() => {
    return location.state?.fromRoot === true
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval>>()
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const prevIndexRef = useRef(currentEPIndex)
  const directionRef = useRef(0)

  // Compute direction synchronously so it's available before AnimatePresence renders
  if (prevIndexRef.current !== currentEPIndex) {
    const len = EP_THEMES.length
    const forwardDist = (currentEPIndex - prevIndexRef.current + len) % len
    const backwardDist = (prevIndexRef.current - currentEPIndex + len) % len
    directionRef.current = forwardDist <= backwardDist ? 1 : -1
    prevIndexRef.current = currentEPIndex
  }

  // Navigate to next EP
  const nextEP = () => {
    const nextId = getNextEPId(epId)
    setCurrentTrack(0)
    setStoryProgress(100)
    setIsPlaying(false)
    setAutoPlay(false)
    navigate(`/ep/${nextId}`)
  }

  // Navigate to previous EP
  const prevEP = () => {
    const prevId = getPrevEPId(epId)
    setCurrentTrack(0)
    setStoryProgress(100)
    setIsPlaying(false)
    setAutoPlay(false)
    navigate(`/ep/${prevId}`)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextEP()
      } else if (e.key === 'ArrowLeft') {
        prevEP()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  // Auto-advance carousel
  useEffect(() => {
    if (!autoPlay) return

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current)
    }

    setStoryProgress(0)

    progressIntervalRef.current = setInterval(() => {
      setStoryProgress((prev) => {
        const next = prev + 100 / (SLIDE_DURATION / 100)
        return Math.min(next, 100)
      })
    }, 100)

    autoPlayTimeoutRef.current = setTimeout(() => {
      const nextId = getNextEPId(epId)
      setCurrentTrack(0)
      setStoryProgress(0)
      setIsPlaying(false)
      navigate(`/ep/${nextId}`, { state: { fromRoot: true } })
    }, SLIDE_DURATION)

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current)
    }
  }, [epId, autoPlay, navigate])

  // Audio controls
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
        setAutoPlay(false)
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Click artwork to play first track
  const handleArtworkClick = () => {
    setCurrentTrack(0)
    setAutoPlay(false)
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % currentTheme.tracks.length)
    setIsPlaying(false)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + currentTheme.tracks.length) % currentTheme.tracks.length)
    setIsPlaying(false)
  }

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Update audio progress
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => audio.removeEventListener('timeupdate', updateProgress)
  }, [])

  const currentTrackData = currentTheme.tracks[currentTrack]

  return (
    <div className="app" data-theme={currentTheme.id}>
      <StoryProgress eps={EP_THEMES} currentEP={currentEPIndex} storyProgress={storyProgress} />

      {/* Navigation Areas */}
      <div className="nav-area prev" onClick={prevEP} />
      <div className="nav-area next" onClick={nextEP} />

      {/* Atmospheric layers */}
      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

      {/* Animated slide content */}
      <div className="slide-container">
        <AnimatePresence initial={false} mode="popLayout" custom={directionRef.current}>
          <motion.div
            key={epId}
            data-theme={epId}
            custom={directionRef.current}
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
        ref={audioRef}
        trackNumber={currentTrack + 1}
        trackName={currentTrackData.name}
        trackFile={currentTrackData.file}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        onTogglePlay={togglePlay}
        onNextTrack={nextTrack}
        onPrevTrack={prevTrack}
        onVolumeChange={setVolume}
      />

      {/* Bio page link */}
      <button
        className="bio-button"
        onClick={() => navigate('/bio', { state: { fromEP: epId } })}
        title="About Pacific Ghost"
      >
        &#9432;
      </button>

      {/* Auto-play toggle */}
      <button
        className={`auto-play-toggle ${!autoPlay ? 'paused' : ''}`}
        onClick={() => setAutoPlay(!autoPlay)}
        title={autoPlay ? 'Auto-advance enabled' : 'Auto-advance paused - Click to resume'}
      >
        <span className="toggle-icon">{autoPlay ? '⏸' : '▶'}</span>
        <span className="toggle-label">{autoPlay ? 'Auto' : 'Paused'}</span>
      </button>
    </div>
  )
}

export default App
