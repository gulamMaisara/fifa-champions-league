import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oltyfwqotruvicxzenmj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_z3VB839aT907tRCB-amsfg_O5wdjw-E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setAdmins() {
  console.log("Setting AbirSulaman as admin in BOLT-7827...");
  const { error: err1 } = await supabase.from('players').update({ is_admin: true }).match({ name: 'AbirSulaman', group_code: 'BOLT-7827' });
  if (err1) console.error("Error 1:", err1.message);

  console.log("Setting Sulaman as admin in VIPER-5703...");
  const { error: err2 } = await supabase.from('players').update({ is_admin: true }).match({ name: 'Sulaman', group_code: 'VIPER-5703' });
  if (err2) console.error("Error 2:", err2.message);

  console.log("Done updating admins.");
}

setAdmins();
