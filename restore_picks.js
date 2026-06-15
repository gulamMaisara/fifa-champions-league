import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oltyfwqotruvicxzenmj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_z3VB839aT907tRCB-amsfg_O5wdjw-E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function restore() {
  console.log("Fetching played matches...");
  const { data: matches } = await supabase.from('matches').select('id, status').eq('status', 'played').order('id');
  if (!matches || matches.length < 12) {
    console.error("Not enough played matches found!");
    return;
  }
  
  const playedMatches = matches.slice(0, 12);
  const winMatches = playedMatches.slice(0, 8); // 8 matches that someone won
  const drawMatches = playedMatches.slice(8, 12); // 4 matches that were draws

  console.log("Setting results for the 12 played matches...");
  for (const m of winMatches) {
    await supabase.from('matches').update({ result: 'team_a' }).eq('id', m.id);
  }
  for (const m of drawMatches) {
    await supabase.from('matches').update({ result: 'draw' }).eq('id', m.id);
  }

  console.log("Fetching players in FIFA26...");
  const { data: players } = await supabase.from('players').select('id, name').eq('group_code', 'FIFA26');
  
  const targetStats = {
    'Abir': { w: 7, l: 0, d: 4 },
    'Zamee': { w: 6, l: 2, d: 4 },
    'Abu': { w: 5, l: 3, d: 4 },
    'TAREQCR7': { w: 4, l: 0, d: 4 },
    'Taher': { w: 4, l: 3, d: 4 },
    'Tausif': { w: 0, l: 0, d: 1 }
  };

  const newPicks = [];

  for (const p of players) {
    const stats = targetStats[p.name];
    if (!stats) continue;

    // Insert Draws
    for (let i = 0; i < stats.d; i++) {
      newPicks.push({ player_id: p.id, match_id: drawMatches[i].id, picked: 'team_a' });
    }

    // Insert Wins
    for (let i = 0; i < stats.w; i++) {
      newPicks.push({ player_id: p.id, match_id: winMatches[i].id, picked: 'team_a' });
    }

    // Insert Losses (pick team_b for a match where team_a won)
    // Start assigning losses from the end of the winMatches to avoid overlapping with wins
    for (let i = 0; i < stats.l; i++) {
      newPicks.push({ player_id: p.id, match_id: winMatches[7 - i].id, picked: 'team_b' });
    }
  }

  console.log(`Inserting ${newPicks.length} reconstructed picks...`);
  const { error } = await supabase.from('picks').upsert(newPicks, { onConflict: 'player_id, match_id' });
  if (error) {
    console.error("Error inserting picks:", error);
  } else {
    console.log("Picks successfully restored!");
  }
}

restore();
