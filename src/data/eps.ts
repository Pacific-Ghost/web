export interface EPTheme {
  id: string;
  name: string;
  icon: string;
  status: string;
  statusType: "coming" | "available";
  description: string[];
  bgColor: string;
  primary: string;
  secondary: string;
  textColor: string;
  fontFamily: string;
  artwork?: { webp: string; jpg: string; alt: string; credit?: string };
  tracks: Array<{ id: number; name: string; file: string }>;
}

export const EP_THEMES: EPTheme[] = [
  {
    id: "lovesickage",
    name: "LOVE SICK AGE",
    icon: "◆",
    status: "Coming Soon",
    statusType: "coming",
    description: [],
    bgColor: "#0a0515",
    primary: "#e8c36a",
    secondary: "#ffffff",
    textColor: "#f0f0ff",
    fontFamily:
      "'Megrim', 'Futura', 'Trebuchet MS', 'Century Gothic', sans-serif",
    artwork: {
      webp: "/artwork/lovesickage.webp",
      jpg: "/artwork/lovesickage.jpg",
      alt: "Love Sick Age EP cover — black impasto heart on dark glitter",
      credit: "\u00a9 Cynthia Coulombe B\u00e9gin, 2025. Used with permission",
    },
    tracks: [
      { id: 1, name: "Love Sick Age", file: "http://media.pacificghost.fm.s3-website-us-west-1.amazonaws.com/audio/love-sick-age.mp3" },
      { id: 2, name: "Silver Medalist", file: "http://media.pacificghost.fm.s3-website-us-west-1.amazonaws.com/audio/silver-medalist.mp3" },
      { id: 3, name: "Thousand", file: "http://media.pacificghost.fm.s3-website-us-west-1.amazonaws.com/audio/thousand.mp3" },
      { id: 4, name: "Graveyard Moon", file: "http://media.pacificghost.fm.s3-website-us-west-1.amazonaws.com/audio/graveyard-moon.mp3" },
    ],
  },
  {
    id: "thehill",
    name: "THE HILL",
    icon: "⬡",
    status: "Stream Now",
    statusType: "available",
    description: [],
    bgColor: "#1a0a0f",
    primary: "#ff1493",
    secondary: "#ffd700",
    textColor: "#fff5e6",
    fontFamily: "'Monoton', cursive",
    artwork: {
      webp: "/artwork/thehill.webp",
      jpg: "/artwork/thehill.jpg",
      alt: "The Hill EP cover — neon-lit studio with guitar, amps, and pedals bathed in pink light",
    },
    tracks: [
      { id: 1, name: "Golden Daze", file: "/audio/hill1.mp3" },
      { id: 2, name: "Sunset Drive", file: "/audio/hill2.mp3" },
      { id: 3, name: "The Hill", file: "/audio/hill3.mp3" },
      { id: 4, name: "Amber Waves", file: "/audio/hill4.mp3" },
      { id: 5, name: "Fading Light", file: "/audio/hill5.mp3" },
      { id: 6, name: "Last Summer", file: "/audio/hill6.mp3" },
    ],
  },
];

export function getEPIndex(id: string): number {
  const index = EP_THEMES.findIndex((ep) => ep.id === id);
  return index === -1 ? 0 : index;
}

export function getEPById(id: string): EPTheme {
  return EP_THEMES.find((ep) => ep.id === id) ?? EP_THEMES[0];
}

export function getNextEPId(id: string): string {
  const index = getEPIndex(id);
  return EP_THEMES[(index + 1) % EP_THEMES.length].id;
}

export function getPrevEPId(id: string): string {
  const index = getEPIndex(id);
  return EP_THEMES[(index - 1 + EP_THEMES.length) % EP_THEMES.length].id;
}
