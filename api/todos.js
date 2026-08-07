const { getAllFrom } = require('../server/supabaseClient');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const data = await getAllFrom('todos');
    res.status(200).json(data);
  } catch (err) {
    console.error('api/todos error:', err.message || err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
