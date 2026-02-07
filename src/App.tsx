import { useState, useRef, useEffect } from 'react'
import './App.css'

// EP Theme Configuration
interface EPTheme {
  id: string
  name: string
  icon: string
  status: string
  statusType: 'coming' | 'available'
  description: string[]
  bgColor: string
  primary: string
  secondary: string
  textColor: string
  fontFamily: string
  tracks: Array<{ id: number; name: string; file: string }>
}

const EP_THEMES: EPTheme[] = [
  {
    id: 'lovesickage',
    name: 'LOVE SICK AGE',
    icon: '◆',
    status: 'Coming Soon',
    statusType: 'coming',
    description: [
      'Five tracks of reverb-soaked guitars and ethereal vocals.',
      'A hazy journey through neon-lit memories.',
    ],
    bgColor: '#0a0515',
    primary: '#ff006e',
    secondary: '#00d9ff',
    textColor: '#f0f0ff',
    fontFamily: "'Futura', 'Trebuchet MS', 'Century Gothic', sans-serif",
    tracks: [
      { id: 1, name: 'Fading Streetlights', file: '/audio/track1.mp3' },
      { id: 2, name: 'Neon Dreams', file: '/audio/track2.mp3' },
      { id: 3, name: 'Reverb Memories', file: '/audio/track3.mp3' },
      { id: 4, name: 'Midnight Haze', file: '/audio/track4.mp3' },
      { id: 5, name: 'Love Sick Age', file: '/audio/track5.mp3' },
    ],
  },
  {
    id: 'thehill',
    name: 'THE HILL',
    icon: '⬡',
    status: 'Stream Now',
    statusType: 'available',
    description: [
      'Debut EP. Six sun-drenched tracks.',
      'Hazy guitar walls meet golden hour nostalgia.',
    ],
    bgColor: '#1a0a0f',
    primary: '#ff1493',
    secondary: '#ffd700',
    textColor: '#fff5e6',
    fontFamily: "'Copperplate', 'Copperplate Gothic Light', sans-serif",
    tracks: [
      { id: 1, name: 'Golden Daze', file: '/audio/hill1.mp3' },
      { id: 2, name: 'Sunset Drive', file: '/audio/hill2.mp3' },
      { id: 3, name: 'The Hill', file: '/audio/hill3.mp3' },
      { id: 4, name: 'Amber Waves', file: '/audio/hill4.mp3' },
      { id: 5, name: 'Fading Light', file: '/audio/hill5.mp3' },
      { id: 6, name: 'Last Summer', file: '/audio/hill6.mp3' },
    ],
  },
]

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
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout>()

  const currentTheme = EP_THEMES[currentEP]
  const currentTrackData = currentTheme.tracks[currentTrack]

  // Switch to next EP
  const nextEP = () => {
    setCurrentEP((prev) => (prev + 1) % EP_THEMES.length)
    setCurrentTrack(0)
    setStoryProgress(0)
    setIsPlaying(false)
    setAutoPlay(false) // Pause auto-advance when user manually navigates
  }

  // Switch to previous EP
  const prevEP = () => {
    setCurrentEP((prev) => (prev - 1 + EP_THEMES.length) % EP_THEMES.length)
    setCurrentTrack(0)
    setStoryProgress(0)
    setIsPlaying(false)
    setAutoPlay(false) // Pause auto-advance when user manually navigates
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
      nextEP()
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
        setAutoPlay(false) // Pause auto-advance when music starts playing
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Click artwork to play first track
  const handleArtworkClick = () => {
    setCurrentTrack(0)
    setAutoPlay(false) // Pause auto-advance
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
      {/* Story Progress Bars */}
      <div className="story-progress">
        {EP_THEMES.map((ep, index) => (
          <div key={ep.id} className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: index < currentEP ? '100%' : index === currentEP ? `${storyProgress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

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
          <h1 className="ep-title">{currentTheme.name}</h1>
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

      {/* Player bar */}
      <div className="player-bar">
        <div className="player-controls">
          <button className="player-btn" onClick={prevTrack}>
            ⏮
          </button>
          <button className="player-btn" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="player-btn" onClick={nextTrack}>
            ⏭
          </button>
        </div>

        <div className="track-info">
          <div className="track-name">
            {String(currentTrack + 1).padStart(2, '0')} — {currentTrackData.name}
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
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>

        <audio ref={audioRef} src={currentTrackData.file} />
      </div>

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
