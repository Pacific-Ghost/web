import { useLocation, useNavigate } from 'react-router-dom'
import { getEPById, EP_THEMES } from '../data/eps'

export function BioPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const fromEP = (location.state as { fromEP?: string } | null)?.fromEP
  const theme = getEPById(fromEP ?? EP_THEMES[0].id)

  const handleBack = () => {
    navigate(`/ep/${theme.id}`)
  }

  return (
    <div className="bio-page" data-theme={theme.id}>
      <div className="neon-glow-bg" />
      <div className="neon-grid" />
      <div className="grain-layer" />

      <button className="bio-back" onClick={handleBack} title="Back">
        &larr;
      </button>

      <div className="bio-content">
        <h1 className="bio-heading">PACIFIC GHOST</h1>
        <p className="bio-text">
          Pacific Ghost is the solo project of guitarist and songwriter James Skelton, rooted in
          late-night reverb, neon-lit melodies, and the space between shoegaze and synthwave. Drawing
          on cinematic textures and post-punk energy, the music drifts through hazy loops and
          saturated chords, built from layered guitars, drum machines, and atmospheric production.
        </p>
        <p className="bio-text">
          Based in Ottawa, Pacific Ghost emerged from years of bedroom recording sessions and a love
          of tone-heavy, mood-first music. Every track is written, performed, and produced by
          Skelton, blending analog warmth with digital grit. The project lives online &mdash; a
          ghost in the wires, broadcasting from the edges of the dial.
        </p>
      </div>
    </div>
  )
}
