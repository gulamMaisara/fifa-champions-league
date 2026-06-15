import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { intervalToDuration } from "date-fns";

export function formatTimeRemaining(dateStr: string): string | null {
  const kickoff = new Date(dateStr);
  const now = new Date();
  if (kickoff <= now) return null;
  
  const dur = intervalToDuration({ start: now, end: kickoff });
  const parts = [
    dur.months ? `${dur.months}mo` : null,
    dur.days ? `${dur.days}d` : null,
    dur.hours ? `${dur.hours}h` : null,
    dur.minutes ? `${dur.minutes}m` : null,
  ].filter(Boolean);
  
  if (parts.length === 0) return "soon";
  return `in ${parts.join(" ")}`;
}

export function getMatchStatusLabel(status: string, kickoff_at: string | null): string {
  if (status === "not_played") return "Not played";
  if (status === "played") return "Finished";
  if (!kickoff_at) return "Upcoming";
  
  const diffMinutes = (new Date().getTime() - new Date(kickoff_at).getTime()) / 60000;
  if (diffMinutes >= 120) return "Pending Result";
  if (diffMinutes >= 0) return "Started";
  return "Upcoming";
}
export const STADIUM_TIMEZONES: Record<string, string> = {
  "1": "America/Mexico_City", // Azteca
  "2": "America/Mexico_City", // Akron (Guadalajara)
  "3": "America/Monterrey",   // BBVA (Monterrey)
  "4": "America/Chicago",     // AT&T (Dallas)
  "5": "America/Chicago",     // NRG (Houston)
  "6": "America/Chicago",     // Arrowhead (Kansas City)
  "7": "America/New_York",    // Mercedes-Benz (Atlanta)
  "8": "America/New_York",    // Hard Rock (Miami)
  "9": "America/New_York",    // Gillette (Boston)
  "10": "America/New_York",   // Lincoln Financial (Philadelphia)
  "11": "America/New_York",   // MetLife (NY/NJ)
  "12": "America/Toronto",    // BMO Field (Toronto)
  "13": "America/Vancouver",  // BC Place (Vancouver)
  "14": "America/Los_Angeles", // Lumen (Seattle)
  "15": "America/Los_Angeles", // Levi's (SF)
  "16": "America/Los_Angeles", // SoFi (LA)
};
