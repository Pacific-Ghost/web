import { useNavigate } from 'react-router-dom'
import { EPTheme, getEPById, EP_THEMES } from '../data/eps'

export function useEPTheme(epId?: string): [EPTheme, (id: string) => void] {
  const navigate = useNavigate()

  const theme = getEPById(epId ?? EP_THEMES[0].id)

  const setTheme = (id: string) => {
    navigate(`/`, { state: { scrollTo: id } })
  }

  return [theme, setTheme]
}
