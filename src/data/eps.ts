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
  artwork?: { webp: string; jpg: string; alt: string; credit?: string }
  tracks: Array<{ id: number; name: string; file: string }>
  links?: { spotify?: string; appleMusic?: string; bandcamp?: string }
}

export const EP_THEMES: EPTheme[] = [
  {
    id: 'lovesickage',
    name: 'LOVE SICK AGE',
    icon: '◆',
    status: 'Coming Soon',
    statusType: 'coming',
    description: [],
    bgColor: '#0a0515',
    primary: '#e8c36a',
    secondary: '#c8963e',
    textColor: '#f0f0ff',
    fontFamily:
      "'Megrim', 'Futura', 'Trebuchet MS', 'Century Gothic', sans-serif",
    artwork: {
      webp: '/artwork/lovesickage.webp',
      jpg: '/artwork/lovesickage.jpg',
      alt: 'Love Sick Age EP cover — black impasto heart on dark glitter',
      credit: '\u00a9 Cynthia Coulombe B\u00e9gin, 2025. Used with permission',
    },
    tracks: [
      {
        id: 1,
        name: 'Love Sick Age',
        file: 'https://s3.us-west-1.amazonaws.com/media.pacificghost.fm/audio/love-sick-age.mp3',
      },
      {
        id: 2,
        name: 'Silver Medalist',
        file: 'https://s3.us-west-1.amazonaws.com/media.pacificghost.fm/audio/silver-medalist.mp3',
      },
      {
        id: 3,
        name: 'Thousand',
        file: 'https://s3.us-west-1.amazonaws.com/media.pacificghost.fm/audio/thousand.mp3',
      },
      {
        id: 4,
        name: 'Graveyard Moon',
        file: 'https://s3.us-west-1.amazonaws.com/media.pacificghost.fm/audio/graveyard-moon.mp3',
      },
    ],
  },
  {
    id: 'thehill',
    name: 'THE HILL',
    icon: '⬡',
    status: 'Stream Now',
    statusType: 'available',
    description: [],
    bgColor: '#1a0a0f',
    primary: '#ff1493',
    secondary: '#ffd700',
    textColor: '#fff5e6',
    fontFamily: "'Monoton', cursive",
    artwork: {
      webp: '/artwork/thehill.webp',
      jpg: '/artwork/thehill.jpg',
      alt: 'The Hill EP cover — neon-lit studio with guitar, amps, and pedals bathed in pink light',
    },
    tracks: [
      {
        id: 1,
        name: 'Out of the City',
        file: 'https://s3.us-west-1.amazonaws.com/media.pacificghost.fm/audio/out-of-the-city.mp3',
      },
      {
        id: 2,
        name: 'Machine',
        file: 'https://s3.us-west-1.amazonaws.com/media.pacificghost.fm/audio/machine.mp3',
      },
      {
        id: 3,
        name: 'Ambulance',
        file: 'https://s3.us-west-1.amazonaws.com/media.pacificghost.fm/audio/ambulance.mp3',
      },
    ],
    links: {
      spotify: 'https://open.spotify.com/artist/3grYt3aOy0jbxAbDEvzeNm',
      appleMusic: 'https://music.apple.com/us/artist/pacific-ghost/1719889121',
      bandcamp: 'https://pacificghost8675.bandcamp.com/album/the-hill',
    },
  },
]

export function getEPIndex(id: string): number {
  const index = EP_THEMES.findIndex((ep) => ep.id === id)
  return index === -1 ? 0 : index
}

export function getEPById(id: string): EPTheme {
  return EP_THEMES.find((ep) => ep.id === id) ?? EP_THEMES[0]
}

export function getNextEPId(id: string): string {
  const index = getEPIndex(id)
  return EP_THEMES[(index + 1) % EP_THEMES.length].id
}

export function getPrevEPId(id: string): string {
  const index = getEPIndex(id)
  return EP_THEMES[(index - 1 + EP_THEMES.length) % EP_THEMES.length].id
}
