import { useLocation } from 'react-router-dom'
import { useEPTheme } from '../hooks/useEPTheme'

export function BioPage() {
  const location = useLocation()
  const fromEP = (location.state as { fromEP?: string } | null)?.fromEP
  const [theme, setTheme] = useEPTheme(fromEP)

  return (
    <div className="bio-page" data-theme={theme.id}>
      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

      <button
        className="bio-back"
        onClick={() => setTheme(theme.id)}
        title="Back"
      >
        &larr;
      </button>

      <div className="bio-content">
        <h1 className="bio-heading">PACIFIC GHOST</h1>
        <p className="bio-text">
          Pacific Ghost is a Los Angeles-based band formed by Jeff Skelton, Dave
          Lentz, Jason Cottis, and Matt Eldredge. The band shares songwriting
          duties and creates cinematic music that blends indie rock, Americana,
          and surf guitar influences &mdash; drawing from artists like The
          National, War on Drugs, and Father John Misty. Perfect for late-night
          drives and moments of introspection, their songs capture both driving
          urgency and emotional depth.
        </p>
        <p className="bio-text">
          The members have been playing together for over ten years, initially
          performing as Grizzly Derringer, where they released four EPs before
          transitioning to Pacific Ghost. The long history together has created
          a deep musical chemistry and genuine friendship that continues to
          shape their collaborative approach to songwriting and performance.
        </p>
      </div>
    </div>
  )
}
