import { createContext, useContext } from 'react'
import { type IAudioPlayer, audioPlayer } from './AudioPlayer/AudioPlayerService'

export type ServicesContainer = {
  audioPlayer: IAudioPlayer
}

const defaultServices: ServicesContainer = { audioPlayer }

export const ServicesContext = createContext<ServicesContainer>(defaultServices)

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  return (
    <ServicesContext.Provider value={defaultServices}>
      {children}
    </ServicesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useServices(): ServicesContainer {
  return useContext(ServicesContext)
}
