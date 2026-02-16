import { describe, it, expect } from 'vitest'
import { EKGService } from './EKGService'

describe('EKGService.generatePath', () => {
  it('returns a valid SVG path starting with M', () => {
    const path = EKGService.generatePath(0, 1000, 100, 3, 60)
    expect(path).toMatch(/^M /)
  })

  it('contains the correct number of beat segments', () => {
    const path = EKGService.generatePath(0, 1000, 100, 3, 60)
    // Each beat produces one Q...Q pair — count the Q commands
    const qCount = (path.match(/Q /g) || []).length
    expect(qCount).toBe(6) // 2 Q commands per beat × 3 beats
  })

  it('starts at the specified startX and centerY', () => {
    const path = EKGService.generatePath(50, 500, 80, 2, 40)
    expect(path.startsWith('M 50 80')).toBe(true)
  })

  it('uses the full width between startX and endX', () => {
    const path = EKGService.generatePath(0, 600, 100, 2, 50)
    // The last segment should reach endX (600)
    expect(path).toContain('L 600 100')
  })

  it('produces different paths for different amplitudes', () => {
    const pathSmall = EKGService.generatePath(0, 1000, 100, 3, 20)
    const pathLarge = EKGService.generatePath(0, 1000, 100, 3, 80)
    expect(pathSmall).not.toBe(pathLarge)
  })
})

describe('EKGService.PULSE_SPEED', () => {
  it('is a positive number', () => {
    expect(EKGService.PULSE_SPEED).toBeGreaterThan(0)
  })
})
