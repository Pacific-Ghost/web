import { useState, useEffect } from 'react'
import { useServices } from '../services/ServicesProvider'
import type { Track } from '../services/AudioPlayer/AudioPlayerService'

export function useAudioPlayer() {
  const { audioPlayer } = useServices()
  const [isPlaying, setIsPlaying] = useState(() => audioPlayer.getPlaying())
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(() => audioPlayer.getVolume())
  const [currentTrack, setCurrentTrack] = useState(() => audioPlayer.getCurrentTrack().index)
  const [trackName, setTrackName] = useState(() => audioPlayer.getCurrentTrack().name)

  useEffect(() => {
    audioPlayer.onPlaybackChange(setIsPlaying)
    audioPlayer.onProgressChange(setProgress)
    audioPlayer.onTrackChange((index, name) => {
      setCurrentTrack(index)
      setTrackName(name)
    })
    audioPlayer.onVolumeChange(setVolume)
    audioPlayer.onTrackEnded(() => audioPlayer.nextTrack())

    return () => {
      audioPlayer.onPlaybackChange(null)
      audioPlayer.onProgressChange(null)
      audioPlayer.onTrackChange(null)
      audioPlayer.onVolumeChange(null)
      audioPlayer.onTrackEnded(null)
    }
  }, [audioPlayer])

  return {
    isPlaying,
    progress,
    volume,
    currentTrack,
    trackName,
    play: () => audioPlayer.play(),
    pause: () => audioPlayer.pause(),
    toggle: () => audioPlayer.toggle(),
    nextTrack: () => audioPlayer.nextTrack(),
    prevTrack: () => audioPlayer.prevTrack(),
    seek: (percent: number) => audioPlayer.seek(percent),
    setVolume: (v: number) => audioPlayer.setVolume(v),
    setTracks: (tracks: Track[]) => audioPlayer.setTracks(tracks),
    loadTrack: (index: number, autoPlay?: boolean) =>
      audioPlayer.loadTrack(index, autoPlay),
  }
}
