const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment. Add them to your .env or environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getAllFrom(table, options = { select: '*' }) {
  const { data, error } = await supabase.from(table).select(options.select);
  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  getAllFrom,
};
