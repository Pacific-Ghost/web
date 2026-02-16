import {
  render,
  renderHook,
  type RenderOptions,
  type RenderHookOptions,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import {
  ServicesContext,
  type ServicesContainer,
} from './services/ServicesProvider'
import type { AudioPlayer } from './services/AudioPlayer/AudioPlayerService'

export function mockAudioPlayer(
  overrides: Partial<AudioPlayer> = {},
): AudioPlayer {
  return {
    play: vi.fn(),
    pause: vi.fn(),
    toggle: vi.fn(),
    seek: vi.fn(),
    setVolume: vi.fn(),
    setTracks: vi.fn(),
    loadTrack: vi.fn(),
    nextTrack: vi.fn(),
    prevTrack: vi.fn(),
    onPlaybackChange: vi.fn(),
    onProgressChange: vi.fn(),
    onTrackChange: vi.fn(),
    onVolumeChange: vi.fn(),
    onTrackEnded: vi.fn(),
    ...overrides,
  } satisfies AudioPlayer
}

type ProviderOptions = {
  services?: Partial<ServicesContainer>
  route?: string
}

function createWrapper({ services, route }: ProviderOptions = {}) {
  const container: ServicesContainer = {
    audioPlayer: mockAudioPlayer(),
    ...services,
  }

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route ?? '/']}>
        <ServicesContext.Provider value={container}>
          {children}
        </ServicesContext.Provider>
      </MemoryRouter>
    )
  }
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & ProviderOptions,
) {
  const { services, route, ...renderOptions } = options ?? {}
  return render(ui, {
    wrapper: createWrapper({ services, route }),
    ...renderOptions,
  })
}

export function renderHookWithProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> & ProviderOptions,
) {
  const { services, route, ...hookOptions } = options ?? {}
  return renderHook(hook, {
    wrapper: createWrapper({ services, route }),
    ...hookOptions,
  })
}
