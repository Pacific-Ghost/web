export interface EPTheme {
  id: string
  name: string
  icon: string
  status: string
  statusType: 'coming' | 'available'
  description: string[]
  bgColor: string
  primary: string
  secondary: string
  textColor: string
  fontFamily: string
  tracks: Array<{ id: number; name: string; file: string }>
}

export const EP_THEMES: EPTheme[] = [
  {
    id: 'lovesickage',
    name: 'LOVE SICK AGE',
    icon: '◆',
    status: 'Coming Soon',
    statusType: 'coming',
    description: [
      'Five tracks of reverb-soaked guitars and ethereal vocals.',
      'A hazy journey through neon-lit memories.',
    ],
    bgColor: '#0a0515',
    primary: '#ff006e',
    secondary: '#00d9ff',
    textColor: '#f0f0ff',
    fontFamily: "'Megrim', 'Futura', 'Trebuchet MS', 'Century Gothic', sans-serif",
    tracks: [
      { id: 1, name: 'Fading Streetlights', file: '/audio/track1.mp3' },
      { id: 2, name: 'Neon Dreams', file: '/audio/track2.mp3' },
      { id: 3, name: 'Reverb Memories', file: '/audio/track3.mp3' },
      { id: 4, name: 'Midnight Haze', file: '/audio/track4.mp3' },
      { id: 5, name: 'Love Sick Age', file: '/audio/track5.mp3' },
    ],
  },
  {
    id: 'thehill',
    name: 'THE HILL',
    icon: '⬡',
    status: 'Stream Now',
    statusType: 'available',
    description: [
      'Debut EP. Six sun-drenched tracks.',
      'Hazy guitar walls meet golden hour nostalgia.',
    ],
    bgColor: '#1a0a0f',
    primary: '#ff1493',
    secondary: '#ffd700',
    textColor: '#fff5e6',
    fontFamily: "'Copperplate', 'Copperplate Gothic Light', sans-serif",
    tracks: [
      { id: 1, name: 'Golden Daze', file: '/audio/hill1.mp3' },
      { id: 2, name: 'Sunset Drive', file: '/audio/hill2.mp3' },
      { id: 3, name: 'The Hill', file: '/audio/hill3.mp3' },
      { id: 4, name: 'Amber Waves', file: '/audio/hill4.mp3' },
      { id: 5, name: 'Fading Light', file: '/audio/hill5.mp3' },
      { id: 6, name: 'Last Summer', file: '/audio/hill6.mp3' },
    ],
  },
]
