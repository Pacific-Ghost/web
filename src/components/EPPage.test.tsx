import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { EPPage } from './EPPage'
import { EP_THEMES } from '../data/eps'

describe('EPPage', () => {
  const thehill = EP_THEMES[1]

  it('shows Follow button for coming statusType when Spotify link is present', () => {
    const comingEP = {
      ...thehill,
      statusType: 'coming' as const,
      links: { spotify: 'https://open.spotify.com/test' },
    }
    const { getByText } = render(<EPPage theme={comingEP} />)
    expect(getByText('Follow')).not.toBeNull()
  })

  it('shows Stream Now CTA over artwork for available statusType with links', () => {
    const { getByText } = render(<EPPage theme={thehill} />)
    expect(getByText('Stream Now')).not.toBeNull()
  })

  it('opens streaming overlay when artwork is clicked', () => {
    const { container, getByText } = render(<EPPage theme={thehill} />)
    const artworkContainer = container.querySelector('.artwork-container')!
    fireEvent.click(artworkContainer)
    expect(getByText('Spotify')).not.toBeNull()
    expect(getByText('Apple Music')).not.toBeNull()
    expect(getByText('Bandcamp')).not.toBeNull()
  })

  it('renders EP description lines when present', () => {
    const withDesc = {
      ...thehill,
      description: ['Debut EP. Six sun-drenched tracks.'],
    }
    const { getByText } = render(<EPPage theme={withDesc} />)
    expect(getByText('Debut EP. Six sun-drenched tracks.')).not.toBeNull()
  })
})
