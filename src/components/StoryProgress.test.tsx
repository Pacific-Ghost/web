import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { StoryProgress } from './StoryProgress'
import { EP_THEMES } from '../data/eps'

describe('StoryProgress', () => {
  it('renders a progress bar for each EP', () => {
    const { container } = render(
      <StoryProgress eps={EP_THEMES} currentEP={0} currentItemProgress={0} />,
    )
    const bars = container.querySelectorAll('.progress-bar')
    expect(bars.length).toBe(EP_THEMES.length)
  })

  it('fills completed EPs to 100%', () => {
    const { container } = render(
      <StoryProgress eps={EP_THEMES} currentEP={1} currentItemProgress={50} />,
    )
    const fills = container.querySelectorAll('.progress-fill')
    // First EP (index 0) should be 100% — it's before currentEP (1)
    expect((fills[0] as HTMLElement).style.width).toBe('100%')
  })

  it('fills current EP to currentItemProgress percentage', () => {
    const { container } = render(
      <StoryProgress eps={EP_THEMES} currentEP={0} currentItemProgress={42} />,
    )
    const fills = container.querySelectorAll('.progress-fill')
    expect((fills[0] as HTMLElement).style.width).toBe('42%')
  })

  it('leaves future EPs at 0%', () => {
    const { container } = render(
      <StoryProgress eps={EP_THEMES} currentEP={0} currentItemProgress={50} />,
    )
    const fills = container.querySelectorAll('.progress-fill')
    // Second EP (index 1) should be 0% — it's after currentEP (0)
    expect((fills[1] as HTMLElement).style.width).toBe('0%')
  })

  it('handles edge case where currentItemProgress is 100', () => {
    const { container } = render(
      <StoryProgress eps={EP_THEMES} currentEP={0} currentItemProgress={100} />,
    )
    const fills = container.querySelectorAll('.progress-fill')
    expect((fills[0] as HTMLElement).style.width).toBe('100%')
  })
})
