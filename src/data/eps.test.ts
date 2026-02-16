import { describe, it, expect } from 'vitest'
import {
  EP_THEMES,
  getEPIndex,
  getEPById,
  getNextEPId,
  getPrevEPId,
} from './eps'

describe('getEPIndex', () => {
  it('returns correct index for first EP', () => {
    expect(getEPIndex('lovesickage')).toBe(0)
  })

  it('returns correct index for second EP', () => {
    expect(getEPIndex('thehill')).toBe(1)
  })

  it('returns 0 for an invalid ID', () => {
    expect(getEPIndex('nonexistent')).toBe(0)
  })
})

describe('getEPById', () => {
  it('returns the correct EP theme', () => {
    const ep = getEPById('thehill')
    expect(ep.name).toBe('THE HILL')
  })

  it('returns first EP for an invalid ID', () => {
    const ep = getEPById('nonexistent')
    expect(ep.id).toBe(EP_THEMES[0].id)
  })
})

describe('getNextEPId', () => {
  it('returns the next EP id', () => {
    expect(getNextEPId('lovesickage')).toBe('thehill')
  })

  it('wraps around from last to first', () => {
    const lastId = EP_THEMES[EP_THEMES.length - 1].id
    expect(getNextEPId(lastId)).toBe(EP_THEMES[0].id)
  })

  it('falls back to second EP for invalid ID', () => {
    // Invalid ID resolves to index 0, so next is index 1
    expect(getNextEPId('nonexistent')).toBe(EP_THEMES[1].id)
  })
})

describe('getPrevEPId', () => {
  it('returns the previous EP id', () => {
    expect(getPrevEPId('thehill')).toBe('lovesickage')
  })

  it('wraps around from first to last', () => {
    expect(getPrevEPId('lovesickage')).toBe(EP_THEMES[EP_THEMES.length - 1].id)
  })

  it('falls back to last EP for invalid ID', () => {
    // Invalid ID resolves to index 0, so prev is last
    expect(getPrevEPId('nonexistent')).toBe(EP_THEMES[EP_THEMES.length - 1].id)
  })
})
