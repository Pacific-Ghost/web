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
  artwork?: { webp: string; jpg: string; alt: string };
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
    primary: "#ff006e",
    secondary: "#00d9ff",
    textColor: "#f0f0ff",
    fontFamily:
      "'Megrim', 'Futura', 'Trebuchet MS', 'Century Gothic', sans-serif",
    artwork: {
      webp: "/artwork/lovesickage.webp",
      jpg: "/artwork/lovesickage.jpg",
      alt: "Love Sick Age EP cover — black impasto heart on dark glitter",
    },
    tracks: [
      { id: 1, name: "Love Sick Age", file: "/audio/track1.mp3" },
      { id: 2, name: "Silver Medalist", file: "/audio/track2.mp3" },
      { id: 3, name: "Thousand", file: "/audio/track3.mp3" },
      { id: 4, name: "Graveyard Moon", file: "/audio/track4.mp3" },
    ],
  },
  {
    id: "thehill",
    name: "THE HILL",
    icon: "⬡",
    status: "Stream Now",
    statusType: "available",
    description: [
      "Debut EP. Six sun-drenched tracks.",
      "Hazy guitar walls meet golden hour nostalgia.",
    ],
    bgColor: "#1a0a0f",
    primary: "#ff1493",
    secondary: "#ffd700",
    textColor: "#fff5e6",
    fontFamily: "'Copperplate', 'Copperplate Gothic Light', sans-serif",
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
