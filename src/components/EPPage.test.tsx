import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { EPPage } from './EPPage'
import { EP_THEMES } from '../data/eps'

describe('EPPage', () => {
  const thehill = EP_THEMES[1]

  it('calls onArtworkClick when artwork is clicked', () => {
    const handleClick = vi.fn()
    const { container } = render(
      <EPPage theme={thehill} onArtworkClick={handleClick} />,
    )
    const artwork = container.querySelector('.artwork-container')!
    fireEvent.click(artwork)
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('shows Follow button for coming statusType when Spotify link is present', () => {
    const comingEP = {
      ...thehill,
      statusType: 'coming' as const,
      links: { spotify: 'https://open.spotify.com/test' },
    }
    const { getByText } = render(
      <EPPage theme={comingEP} onArtworkClick={() => {}} />,
    )
    expect(getByText('Follow')).not.toBeNull()
  })

  it('shows Spotify, Apple Music, Bandcamp buttons for available statusType', () => {
    const { getByText } = render(
      <EPPage theme={thehill} onArtworkClick={() => {}} />,
    )
    expect(getByText('Spotify')).not.toBeNull()
    expect(getByText('Apple Music')).not.toBeNull()
    expect(getByText('Bandcamp')).not.toBeNull()
  })

  it('renders EP description lines when present', () => {
    const withDesc = {
      ...thehill,
      description: ['Debut EP. Six sun-drenched tracks.'],
    }
    const { getByText } = render(
      <EPPage theme={withDesc} onArtworkClick={() => {}} />,
    )
    expect(getByText('Debut EP. Six sun-drenched tracks.')).not.toBeNull()
  })
})
