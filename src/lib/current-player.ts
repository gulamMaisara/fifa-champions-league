import { useEffect, useState } from "react";

const KEY = "fifa_fantasy_current_player";

export type CurrentPlayer = { id: string; name: string } | null;

export function getCurrentPlayer(): CurrentPlayer {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
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
