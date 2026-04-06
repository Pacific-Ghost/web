import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveSection } from './useActiveSection'

const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
const mockUnobserve = vi.fn()

let observerCallback: IntersectionObserverCallback

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn((cb: IntersectionObserverCallback) => {
    observerCallback = cb
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: mockUnobserve,
    }
  }),
)

describe('useActiveSection', () => {
  beforeEach(() => {
    mockObserve.mockClear()
    mockDisconnect.mockClear()
    mockUnobserve.mockClear()
  })

  it('returns the first section id by default', () => {
    const ids = ['lovesickage', 'thehill']
    const refs = ids.map(() => ({ current: document.createElement('div') }))
    const { result } = renderHook(() => useActiveSection(ids, refs))
    expect(result.current).toBe('lovesickage')
  })

  it('observes all provided refs', () => {
    const ids = ['lovesickage', 'thehill']
    const refs = ids.map(() => ({ current: document.createElement('div') }))
    renderHook(() => useActiveSection(ids, refs))
    expect(mockObserve).toHaveBeenCalledTimes(2)
  })

  it('updates active section when intersection changes', () => {
    const ids = ['lovesickage', 'thehill']
    const el1 = document.createElement('div')
    const el2 = document.createElement('div')
    const refs = [{ current: el1 }, { current: el2 }]
    const { result } = renderHook(() => useActiveSection(ids, refs))

    // Simulate thehill becoming most visible
    act(() => {
      observerCallback(
        [
          {
            target: el1,
            intersectionRatio: 0.2,
          } as unknown as IntersectionObserverEntry,
          {
            target: el2,
            intersectionRatio: 0.8,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      )
    })

    expect(result.current).toBe('thehill')
  })

  it('does not switch when no section exceeds 50% visibility', () => {
    const ids = ['lovesickage', 'thehill']
    const el1 = document.createElement('div')
    const el2 = document.createElement('div')
    const refs = [{ current: el1 }, { current: el2 }]
    const { result } = renderHook(() => useActiveSection(ids, refs))

    // Both sections partially visible during mid-scroll
    act(() => {
      observerCallback(
        [
          {
            target: el1,
            intersectionRatio: 0.4,
          } as unknown as IntersectionObserverEntry,
          {
            target: el2,
            intersectionRatio: 0.45,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      )
    })

    // Should stay on first section — neither crossed 50%
    expect(result.current).toBe('lovesickage')
  })

  it('disconnects observer on unmount', () => {
    const ids = ['lovesickage', 'thehill']
    const refs = ids.map(() => ({ current: document.createElement('div') }))
    const { unmount } = renderHook(() => useActiveSection(ids, refs))
    unmount()
    expect(mockDisconnect).toHaveBeenCalled()
  })
})
