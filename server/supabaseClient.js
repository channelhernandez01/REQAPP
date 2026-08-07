const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.');
  }

  return createClient(url, key);
}

async function getAllFrom(table, options = { select: '*' }) {
  const supabase = getClient();
  const { data, error } = await supabase.from(table).select(options.select);
  if (error) throw error;
  return data;
}

module.exports = {
  getAllFrom,
};
