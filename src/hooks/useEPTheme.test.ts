import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useEPTheme } from './useEPTheme'
import { EP_THEMES } from '../data/eps'
import React from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(MemoryRouter, null, children)

describe('useEPTheme', () => {
  it('returns theme for the given EP id', () => {
    const { result } = renderHook(() => useEPTheme('thehill'), { wrapper })
    const [theme] = result.current
    expect(theme.id).toBe('thehill')
  })

  it('falls back to first EP when no id provided', () => {
    const { result } = renderHook(() => useEPTheme(), { wrapper })
    const [theme] = result.current
    expect(theme.id).toBe(EP_THEMES[0].id)
  })

  it('returns a setTheme function', () => {
    const { result } = renderHook(() => useEPTheme(), { wrapper })
    const [, setTheme] = result.current
    expect(typeof setTheme).toBe('function')
  })
})
