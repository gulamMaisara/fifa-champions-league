import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oltyfwqotruvicxzenmj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_z3VB839aT907tRCB-amsfg_O5wdjw-E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: matches, error } = await supabase.from('matches').select('id, created_at, team_a').order('created_at', { ascending: true }).limit(10);
  console.log("Oldest matches:", matches);
}

check();
