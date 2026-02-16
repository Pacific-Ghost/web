import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { EPPage } from './EPPage'
import { EP_THEMES } from '../data/eps'

describe('EPPage', () => {
  const lovesickage = EP_THEMES[0] // statusType: 'coming', id: 'lovesickage'
  const thehill = EP_THEMES[1] // statusType: 'available', id: 'thehill'

  it('renders the EP name for a non-lovesickage EP', () => {
    const { container } = render(
      <EPPage theme={thehill} onArtworkClick={() => {}} />,
    )
    const h1 = container.querySelector('h1.ep-title')
    expect(h1).not.toBeNull()
    expect(h1!.textContent).toBe('THE HILL')
  })

  it('renders HeartbeatTitle for lovesickage EP', () => {
    const { container } = render(
      <EPPage theme={lovesickage} onArtworkClick={() => {}} />,
    )
    const heartbeat = container.querySelector('.heartbeat-title')
    expect(heartbeat).not.toBeNull()
    // Should NOT have a plain h1.ep-title
    const plainTitle = container.querySelector('h1.ep-title')
    expect(plainTitle).toBeNull()
  })

  it('calls onArtworkClick when artwork is clicked', () => {
    const handleClick = vi.fn()
    const { container } = render(
      <EPPage theme={thehill} onArtworkClick={handleClick} />,
    )
    const artwork = container.querySelector('.artwork-container')!
    fireEvent.click(artwork)
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('shows Pre-Save and Follow buttons for coming statusType', () => {
    const { getByText } = render(
      <EPPage theme={lovesickage} onArtworkClick={() => {}} />,
    )
    expect(getByText('Pre-Save')).not.toBeNull()
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

  it('renders the PACIFIC GHOST subtitle', () => {
    const { getByText } = render(
      <EPPage theme={thehill} onArtworkClick={() => {}} />,
    )
    expect(getByText('PACIFIC GHOST')).not.toBeNull()
  })
})
