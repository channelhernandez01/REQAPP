require('dotenv').config();
const http = require('http');
const { getAllFrom } = require('./supabaseClient');

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/api/todos') {
    try {
      const data = await getAllFrom('todos');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
