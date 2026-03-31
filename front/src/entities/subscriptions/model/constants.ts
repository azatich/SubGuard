import {
  MonitorPlay,
  Headphones,
  Terminal,
  ShoppingBag,
  HeartPulse,
  Box,
  Bot,         // Для AI
  Cloud,       // Для Cloud
  Gamepad2,    // Для Gaming
  ShieldCheck, // Для VPN
  Dumbbell,    // Для Fitness (или можно использовать HeartPulse)
  GraduationCap // Для Education
} from "lucide-react";
import { CategoryConfig, SubscriptionTemplate } from "./types";

export const POPULAR_SUBSCRIPTIONS: SubscriptionTemplate[] = [
  {
    name: "Netflix",
    category: "Entertainment",
    color: "#E50914",
    logoUrl: "https://cdn.simpleicons.org/netflix/white",
  },
  {
    name: "Spotify",
    category: "Music",
    color: "#1DB954",
    logoUrl: "https://cdn.simpleicons.org/spotify/white",
  },
  {
    name: "YouTube Premium",
    category: "Entertainment",
    color: "#FF0000",
    logoUrl: "https://cdn.simpleicons.org/youtube/white",
  },
  {
    name: "Telegram Premium",
    category: "Software",
    color: "#0088CC",
    logoUrl: "https://cdn.simpleicons.org/telegram/white",
  },
  {
    name: "GitHub Copilot",
    category: "Software",
    color: "#FFFFFF",
    logoUrl: "https://cdn.simpleicons.org/github/black", // черный логотип для белого фона
  },
  {
    name: "Apple Music",
    category: "Music",
    color: "#FA243C",
    logoUrl: "https://cdn.simpleicons.org/apple/white",
  },
  {
    name: "Apple TV+",
    category: "Entertainment",
    color: "#000000",
    logoUrl: "https://cdn.simpleicons.org/appletv/white",
  },
  {
    name: "Crunchyroll",
    category: "Entertainment",
    color: "#F47521",
    logoUrl: "https://cdn.simpleicons.org/crunchyroll/white",
  },
  {
    name: "Twitch",
    category: "Entertainment",
    color: "#9146FF",
    logoUrl: "https://cdn.simpleicons.org/twitch/white",
  },

  // Music
  {
    name: "Tidal",
    category: "Music",
    color: "#000000",
    logoUrl: "https://cdn.simpleicons.org/tidal/white",
  },
  {
    name: "Deezer",
    category: "Music",
    color: "#FEAA2D",
    logoUrl: "https://cdn.simpleicons.org/deezer/white",
  },
  {
    name: "SoundCloud",
    category: "Music",
    color: "#FF5500",
    logoUrl: "https://cdn.simpleicons.org/soundcloud/white",
  },

  // AI Tools
  {
    name: "ChatGPT Plus",
    category: "AI",
    color: "#74AA9C",
    logoUrl: "https://cdn.simpleicons.org/openai/white",
  },
  {
    name: "Claude Pro",
    category: "AI",
    color: "#D97757",
    logoUrl: "https://cdn.simpleicons.org/anthropic/white",
  },
  {
    name: "Midjourney",
    category: "AI",
    color: "#000000",
    logoUrl: "https://cdn.simpleicons.org/midjourney/white",
  },
  {
    name: "Perplexity Pro",
    category: "AI",
    color: "#20808D",
    logoUrl: "https://cdn.simpleicons.org/perplexity/white",
  },
  {
    name: "Cursor",
    category: "AI",
    color: "#000000",
    logoUrl: "https://cdn.simpleicons.org/cursor/white",
  },

  // Software / Productivity
  {
    name: "Notion",
    category: "Software",
    color: "#000000",
    logoUrl: "https://cdn.simpleicons.org/notion/white",
  },
  {
    name: "Figma",
    category: "Software",
    color: "#F24E1E",
    logoUrl: "https://cdn.simpleicons.org/figma/white",
  },
  {
    name: "Adobe Creative Cloud",
    category: "Software",
    color: "#FF0000",
    logoUrl: "https://cdn.simpleicons.org/adobe/white",
  },
  {
    name: "Microsoft 365",
    category: "Software",
    color: "#D83B01",
    logoUrl: "https://cdn.simpleicons.org/microsoft/white",
  },
  {
    name: "Dropbox",
    category: "Software",
    color: "#0061FF",
    logoUrl: "https://cdn.simpleicons.org/dropbox/white",
  },
  {
    name: "1Password",
    category: "Software",
    color: "#0094F5",
    logoUrl: "https://cdn.simpleicons.org/1password/white",
  },
  {
    name: "Grammarly",
    category: "Software",
    color: "#15C39A",
    logoUrl: "https://cdn.simpleicons.org/grammarly/white",
  },
  {
    name: "Linear",
    category: "Software",
    color: "#5E6AD2",
    logoUrl: "https://cdn.simpleicons.org/linear/white",
  },
  {
    name: "JetBrains",
    category: "Software",
    color: "#000000",
    logoUrl: "https://cdn.simpleicons.org/jetbrains/white",
  },

  // Cloud / Dev
  {
    name: "Vercel Pro",
    category: "Cloud",
    color: "#000000",
    logoUrl: "https://cdn.simpleicons.org/vercel/white",
  },
  {
    name: "DigitalOcean",
    category: "Cloud",
    color: "#0080FF",
    logoUrl: "https://cdn.simpleicons.org/digitalocean/white",
  },

  // Gaming
  {
    name: "Xbox Game Pass",
    category: "Gaming",
    color: "#107C10",
    logoUrl: "https://cdn.simpleicons.org/xbox/white",
  },
  {
    name: "PlayStation Plus",
    category: "Gaming",
    color: "#003791",
    logoUrl: "https://cdn.simpleicons.org/playstation/white",
  },
  {
    name: "EA Play",
    category: "Gaming",
    color: "#FF4747",
    logoUrl: "https://cdn.simpleicons.org/ea/white",
  },

  // VPN / Security
  {
    name: "NordVPN",
    category: "VPN",
    color: "#4687FF",
    logoUrl: "https://cdn.simpleicons.org/nordvpn/white",
  },
  {
    name: "ExpressVPN",
    category: "VPN",
    color: "#DA3940",
    logoUrl: "https://cdn.simpleicons.org/expressvpn/white",
  },
  {
    name: "ProtonVPN",
    category: "VPN",
    color: "#6D4AFF",
    logoUrl: "https://cdn.simpleicons.org/protonvpn/white",
  },

  // Fitness
  {
    name: "Strava",
    category: "Fitness",
    color: "#FC4C02",
    logoUrl: "https://cdn.simpleicons.org/strava/white",
  },
  {
    name: "Calm",
    category: "Fitness",
    color: "#0C4A8E",
    logoUrl: "https://cdn.simpleicons.org/calm/white",
  },
  {
    name: "Duolingo",
    category: "Education",
    color: "#58CC02",
    logoUrl: "https://cdn.simpleicons.org/duolingo/white",
  },
];

export const SUBSCRIPTION_CATEGORIES: Record<string, CategoryConfig> = {
  Entertainment: {
    label: "Развлечения",
    icon: MonitorPlay,
    colorClass: "bg-red-500/10 text-red-500",
  },
  Music: {
    label: "Музыка и Аудио",
    icon: Headphones,
    colorClass: "bg-blue-500/10 text-blue-500",
  },
  Software: {
    label: "Софт и Инструменты",
    icon: Terminal,
    colorClass: "bg-purple-500/10 text-purple-500",
  },
  Shopping: {
    label: "Шопинг",
    icon: ShoppingBag,
    colorClass: "bg-orange-500/10 text-orange-500",
  },
  Health: {
    label: "Здоровье",
    icon: HeartPulse,
    colorClass: "bg-green-500/10 text-[#2cfc73]",
  },
  AI: {
    label: "Нейросети (AI)",
    icon: Bot,
    colorClass: "bg-teal-500/10 text-teal-400",
  },
  Cloud: {
    label: "Облака и Хостинг",
    icon: Cloud,
    colorClass: "bg-sky-500/10 text-sky-400",
  },
  Gaming: {
    label: "Игры",
    icon: Gamepad2,
    colorClass: "bg-emerald-500/10 text-emerald-500",
  },
  VPN: {
    label: "VPN и Безопасность",
    icon: ShieldCheck,
    colorClass: "bg-indigo-500/10 text-indigo-400",
  },
  Fitness: {
    label: "Фитнес и Спорт",
    icon: Dumbbell,
    colorClass: "bg-rose-500/10 text-rose-500", // Или можно объединить с Health
  },
  Education: {
    label: "Обучение",
    icon: GraduationCap,
    colorClass: "bg-yellow-500/10 text-yellow-500",
  },
};

export const SUBSCRIPTION_CYCLES: Record<string, string> = {
  Monthly: "Ежемесячно",
  Yearly: "Ежегодно",
};

export const getCategoryConfig = (categoryKey: string): CategoryConfig => {
  return (
    SUBSCRIPTION_CATEGORIES[categoryKey] || {
      label: "Другое",
      icon: Box,
      colorClass: "bg-zinc-800 text-zinc-400",
    }
  );
};
