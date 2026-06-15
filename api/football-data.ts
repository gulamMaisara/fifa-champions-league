import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.VITE_FOOTBALL_API || "";

  try {
    const response = await fetch(
      "https://api.football-data.org/v4/competitions/2000/matches",
      {
        headers: {
          "X-Auth-Token": apiKey,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ matches: [], error: `API Error: ${response.status}` });
    }

    const data = await response.json();
    // Cache for 60 seconds on Vercel edge
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ matches: [], error: error.message || "Unknown error" });
  }
}
