import { useEffect, useState } from "react";

const KEY = "fifa_fantasy_current_player";

export type CurrentPlayer = { id: string; name: string; group_code: string; is_admin?: boolean } | null;

export function getCurrentPlayer(): CurrentPlayer {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    // If stored player doesn't have group_code (old session), treat as needing re-join
    if (!p?.group_code) return null;
    return p;
  } catch {
    return null;
  }
}

export function setCurrentPlayer(p: CurrentPlayer) {
  if (typeof window === "undefined") return;
  if (p) localStorage.setItem(KEY, JSON.stringify(p));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("current-player-changed"));
}

export function useCurrentPlayer(): CurrentPlayer {
  const [p, setP] = useState<CurrentPlayer>(null);
  useEffect(() => {
    setP(getCurrentPlayer());
    const handler = () => setP(getCurrentPlayer());
    window.addEventListener("current-player-changed", handler);
    return () => window.removeEventListener("current-player-changed", handler);
  }, []);
  return p;
}

const WORDS = [
  "EAGLE", "TIGER", "FALCON", "STORM", "BLADE", "COBRA", "VIPER",
  "SHARK", "WOLF", "LION", "RAVEN", "BOLT", "FLARE", "NOVA",
  "BLAZE", "FROST", "GHOST", "HAWK", "PUMA", "EMBER",
];

export function generateGroupCode(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${num}`;
}
