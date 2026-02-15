import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useEPTheme } from './useEPTheme'
import { EP_THEMES } from '../data/eps'
import React from 'react'

const wrapper = (initialRoute: string) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      { initialEntries: [initialRoute] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: '/ep/:id', element: children }),
        React.createElement(Route, { path: '/bio', element: children }),
        React.createElement(Route, { path: '*', element: children })
      )
    )
}

describe('useEPTheme', () => {
  it('resolves theme from route params', () => {
    const { result } = renderHook(() => useEPTheme(), {
      wrapper: wrapper('/ep/thehill'),
    })
    const [theme] = result.current
    expect(theme.id).toBe('thehill')
  })

  it('falls back to first EP when no route param and no override', () => {
    const { result } = renderHook(() => useEPTheme(), {
      wrapper: wrapper('/bio'),
    })
    const [theme] = result.current
    expect(theme.id).toBe(EP_THEMES[0].id)
  })

  it('overrideId takes precedence over route params', () => {
    const { result } = renderHook(() => useEPTheme('thehill'), {
      wrapper: wrapper('/ep/lovesickage'),
    })
    const [theme] = result.current
    expect(theme.id).toBe('thehill')
  })

  it('returns a setTheme function', () => {
    const { result } = renderHook(() => useEPTheme(), {
      wrapper: wrapper('/ep/lovesickage'),
    })
    const [, setTheme] = result.current
    expect(typeof setTheme).toBe('function')
  })
})
