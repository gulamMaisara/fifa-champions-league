import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oltyfwqotruvicxzenmj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_z3VB839aT907tRCB-amsfg_O5wdjw-E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: picks } = await supabase.from('picks').select('*');
  console.log("Total picks now:", picks?.length);
}

check();
