import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCarousel } from './useCarousel'

describe('useCarousel', () => {
  const items = new Set(['a', 'b', 'c'])
  const ctx = {} as { onNavigate: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    ctx.onNavigate = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', ctx.onNavigate))
    expect(result.current.currentItemProgress).toBe(0)
    expect(result.current.autoPlay).toBe(false)
    expect(result.current.direction).toBe('right')
  })

  it('next navigates to the next item', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', ctx.onNavigate))
    act(() => {
      result.current.next()
    })
    expect(ctx.onNavigate).toHaveBeenCalledWith('b')
  })

  it('next wraps from last to first', () => {
    const { result } = renderHook(() => useCarousel(items, 'c', ctx.onNavigate))
    act(() => {
      result.current.next()
    })
    expect(ctx.onNavigate).toHaveBeenCalledWith('a')
  })

  it('prev navigates to the previous item', () => {
    const { result } = renderHook(() => useCarousel(items, 'b', ctx.onNavigate))
    act(() => {
      result.current.prev()
    })
    expect(ctx.onNavigate).toHaveBeenCalledWith('a')
  })

  it('prev wraps from first to last', () => {
    const { result } = renderHook(() => useCarousel(items, 'a', ctx.onNavigate))
    act(() => {
      result.current.prev()
    })
    expect(ctx.onNavigate).toHaveBeenCalledWith('c')
  })

  it('direction is right after next', () => {
    const { result, rerender } = renderHook(
      ({ id }) => useCarousel(items, id, ctx.onNavigate),
      { initialProps: { id: 'a' } },
    )
    act(() => {
      result.current.next()
    })
    rerender({ id: 'b' })
    expect(result.current.direction).toBe('right')
  })

  it('direction is left after prev', () => {
    const { result, rerender } = renderHook(
      ({ id }) => useCarousel(items, id, ctx.onNavigate),
      { initialProps: { id: 'b' } },
    )
    act(() => {
      result.current.prev()
    })
    rerender({ id: 'a' })
    expect(result.current.direction).toBe('left')
  })

  it('auto-advance calls ctx.onNavigate after slideDuration', () => {
    const { result } = renderHook(() =>
      useCarousel(items, 'a', ctx.onNavigate, 5000),
    )
    act(() => {
      result.current.toggleAutoPlay()
    })
    expect(result.current.autoPlay).toBe(true)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(ctx.onNavigate).toHaveBeenCalledWith('b')
  })

  it('currentItemProgress increases during autoPlay', () => {
    const { result } = renderHook(() =>
      useCarousel(items, 'a', ctx.onNavigate, 10000),
    )
    act(() => {
      result.current.toggleAutoPlay()
    })
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.currentItemProgress).toBeGreaterThan(40)
    expect(result.current.currentItemProgress).toBeLessThan(60)
  })

  it('toggleAutoPlay disables auto-advance', () => {
    const { result } = renderHook(() =>
      useCarousel(items, 'a', ctx.onNavigate, 5000),
    )
    act(() => {
      result.current.toggleAutoPlay()
    }) // enable
    act(() => {
      result.current.toggleAutoPlay()
    }) // disable
    expect(result.current.autoPlay).toBe(false)
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(ctx.onNavigate).not.toHaveBeenCalled()
  })
})
