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
