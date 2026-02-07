import { useState, useRef, useEffect } from 'react'
import './App.css'
import { EP_THEMES } from './data/eps'
import { HeartbeatTitle } from './components/HeartbeatTitle'
import { StoryProgress } from './components/StoryProgress'
import { PlayerBar } from './components/PlayerBar'

const SLIDE_DURATION = 10000 // 10 seconds

function App() {
  const [currentEP, setCurrentEP] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const [volume, setVolume] = useState(70)
  const [autoPlay, setAutoPlay] = useState(true)

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval>>()
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const currentTheme = EP_THEMES[currentEP]
  const currentTrackData = currentTheme.tracks[currentTrack]

  // Switch to next EP
  const nextEP = () => {
    setCurrentEP((prev) => (prev + 1) % EP_THEMES.length)
    setCurrentTrack(0)
    setStoryProgress(0)
    setIsPlaying(false)
    setAutoPlay(false)
  }

  // Switch to previous EP
  const prevEP = () => {
    setCurrentEP((prev) => (prev - 1 + EP_THEMES.length) % EP_THEMES.length)
    setCurrentTrack(0)
    setStoryProgress(0)
    setIsPlaying(false)
    setAutoPlay(false)
  }

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
      setCurrentEP((prev) => (prev + 1) % EP_THEMES.length)
      setCurrentTrack(0)
      setStoryProgress(0)
      setIsPlaying(false)
    }, SLIDE_DURATION)

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current)
    }
  }, [currentEP, autoPlay])

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

  return (
    <div className="app" data-theme={currentTheme.id}>
      <StoryProgress eps={EP_THEMES} currentEP={currentEP} storyProgress={storyProgress} />

      {/* Navigation Areas */}
      <div className="nav-area prev" onClick={prevEP} />
      <div className="nav-area next" onClick={nextEP} />

      {/* Atmospheric layers */}
      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

      {/* Main content */}
      <div className="site-content">
        <div className="artwork-container" onClick={handleArtworkClick} style={{ cursor: 'pointer' }}>
          <div className="artwork-glow-outer" />
          <div className="artwork-frame">
            <div className="artwork-image">
              <div className="artwork-pattern" />
              <div className="artwork-icon">{currentTheme.icon}</div>
            </div>
          </div>
        </div>

        <div className="ep-info">
          <div className="ep-subtitle">PACIFIC GHOST</div>
          {currentTheme.id === 'lovesickage' ? (
            <HeartbeatTitle text={currentTheme.name} />
          ) : (
            <h1 className="ep-title">{currentTheme.name}</h1>
          )}
          <div className={`ep-status ${currentTheme.statusType}`}>{currentTheme.status}</div>
          <p className="ep-description">
            {currentTheme.description.map((line, i) => (
              <span key={i}>
                {line}
                {i < currentTheme.description.length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="links">
            {currentTheme.statusType === 'coming' ? (
              <>
                <a href="#" className="link-btn">
                  <span className="link-icon">◈</span>
                  <span>Pre-Save</span>
                </a>
                <a href="#" className="link-btn">
                  <span className="link-icon">♪</span>
                  <span>Follow</span>
                </a>
              </>
            ) : (
              <>
                <a href="#" className="link-btn">
                  <span className="link-icon">▶</span>
                  <span>Spotify</span>
                </a>
                <a href="#" className="link-btn">
                  <span className="link-icon">♪</span>
                  <span>Apple Music</span>
                </a>
                <a href="#" className="link-btn">
                  <span className="link-icon">◆</span>
                  <span>Bandcamp</span>
                </a>
              </>
            )}
          </div>
        </div>
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
