import { useParams, useNavigate } from 'react-router-dom'
import { EPTheme, getEPById, EP_THEMES } from '../data/eps'

export function useEPTheme(overrideId?: string): [EPTheme, (id: string) => void] {
  const { id: routeId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const epId = overrideId ?? routeId ?? EP_THEMES[0].id
  const theme = getEPById(epId)

  const setTheme = (id: string) => {
    navigate(`/ep/${id}`)
  }

  return [theme, setTheme]
}
