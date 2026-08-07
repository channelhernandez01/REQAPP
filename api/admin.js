const { listRequests } = require('../server/supabaseClient');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const password = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const requests = await listRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Admin request listing error:', error);
    res.status(500).json({ error: 'Could not load requests.' });
  }
};
