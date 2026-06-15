import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oltyfwqotruvicxzenmj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_z3VB839aT907tRCB-amsfg_O5wdjw-E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreWithoutChangingMatches() {
  console.log("Fetching players...");
  const { data: players } = await supabase.from('players').select('id, name').eq('group_code', 'FIFA26');

  const playerMap = {};
  for (const p of players) {
    playerMap[p.name] = p.id;
  }

  const matchMap = {
    M1: '00000000-0000-0000-0000-000000000001', // Mexico
    M2: '00000000-0000-0000-0000-000000000002', // South Korea
    M3: '00000000-0000-0000-0000-000000000003', // Draw 1
    M4: '00000000-0000-0000-0000-000000000004', // Paraguay
    M5: '00000000-0000-0000-0000-000000000005', // Haiti (team_b win!)
    M6: '00000000-0000-0000-0000-000000000006', // Turkey
    M7: '00000000-0000-0000-0000-000000000007', // Morocco (Draw 2)
    M8: '00000000-0000-0000-0000-000000000008', // Draw 3
    M9: '00000000-0000-0000-0000-000000000009', // Ecuador
    M10: '00000000-0000-0000-0000-000000000010', // Win match
    M11: '00000000-0000-0000-0000-000000000011', // Draw 4
    M12: '00000000-0000-0000-0000-000000000012', // Tunisia
    M13: '00000000-0000-0000-0000-000000000013', // Win match
  };

  const newPicks = [];
  const addPick = (name, mKey, picked) => {
    if (playerMap[name]) {
      newPicks.push({ player_id: playerMap[name], match_id: matchMap[mKey], picked });
    }
  };

  // DRAWS (M3, M7, M8, M11)
  const drawList = ['M3', 'M7', 'M8', 'M11'];
  for (const name of ['Abir', 'Zamee', 'Abu', 'TAREQCR7', 'Taher']) {
    for (const d of drawList) {
      addPick(name, d, 'team_a');
    }
  }
  // Tausif only picked Morocco
  addPick('Tausif', 'M7', 'team_a');

  // MATCH 1 (Mexico vs South Africa, team_a won)
  // Abu and Zamee picked Mexico -> win
  addPick('Abu', 'M1', 'team_a');
  addPick('Zamee', 'M1', 'team_a');

  // MATCH 2 (South Korea vs Czech, team_a won)
  // Abir, Abu, Zamee played. (All wins, because none lost here)
  addPick('Abir', 'M2', 'team_a');
  addPick('Abu', 'M2', 'team_a');
  addPick('Zamee', 'M2', 'team_a');

  // SPECIFIC LOSSES
  // M6 = Australia vs Turkey (team_a won)
  // M9 = Ivory Coast vs Ecuador (team_a won)
  // M12 = Sweden vs Tunisia (team_a won)
  // M4 = US vs Paraguay (team_a won)

  // Abu losses: Turkey(M6), Ecuador(M9), Tunisia(M12)
  addPick('Abu', 'M6', 'team_b');
  addPick('Abu', 'M9', 'team_b');
  addPick('Abu', 'M12', 'team_b');

  // Zamee losses: Turkey(M6), Ecuador(M9)
  addPick('Zamee', 'M6', 'team_b');
  addPick('Zamee', 'M9', 'team_b');

  // Taher losses: Paraguay(M4), Turkey(M6), Ecuador(M9)
  addPick('Taher', 'M4', 'team_b');
  addPick('Taher', 'M6', 'team_b');
  addPick('Taher', 'M9', 'team_b');

  // REMAINING WINS
  // Note: M5 (Haiti vs Scotland) was won by team_b! To get a win on M5, must pick 'team_b'.
  // All other win matches (4, 6, 9, 10, 12, 13) were won by team_a.

  // Abu Needs: 3 more wins (has M1, M2).
  addPick('Abu', 'M4', 'team_a');
  addPick('Abu', 'M5', 'team_b');
  addPick('Abu', 'M10', 'team_a');

  // Zamee Needs: 4 more wins (has M1, M2).
  addPick('Zamee', 'M4', 'team_a');
  addPick('Zamee', 'M5', 'team_b');
  addPick('Zamee', 'M10', 'team_a');
  addPick('Zamee', 'M12', 'team_a');

  // Taher Needs: 4 more wins (has 0).
  addPick('Taher', 'M5', 'team_b');
  addPick('Taher', 'M10', 'team_a');
  addPick('Taher', 'M12', 'team_a');
  addPick('Taher', 'M13', 'team_a');

  // Abir Needs: 6 more wins (has M2).
  addPick('Abir', 'M4', 'team_a');
  addPick('Abir', 'M5', 'team_b');
  addPick('Abir', 'M6', 'team_a');
  addPick('Abir', 'M9', 'team_a');
  addPick('Abir', 'M10', 'team_a');
  addPick('Abir', 'M12', 'team_a');

  // TAREQCR7 Needs: 4 more wins (has 0).
  addPick('TAREQCR7', 'M4', 'team_a');
  addPick('TAREQCR7', 'M5', 'team_b');
  addPick('TAREQCR7', 'M10', 'team_a');
  addPick('TAREQCR7', 'M13', 'team_a');


  console.log(`Clearing existing picks...`);
  await supabase.from('picks').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 

  console.log(`Inserting ${newPicks.length} reconstructed picks...`);
  const { error } = await supabase.from('picks').upsert(newPicks, { onConflict: 'player_id, match_id' });
  if (error) {
    console.error("Error inserting picks:", error);
  } else {
    console.log("Picks successfully restored matching the true results!");
  }
}

restoreWithoutChangingMatches();
