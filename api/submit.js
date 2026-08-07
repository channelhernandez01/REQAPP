const { Resend } = require('resend');

const recipient = 'channelhernandez744@gmail.com';
const sender = 'REQAPP <onboarding@resend.dev>';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    res.status(500).json({ error: 'RESEND_API_KEY is not configured in Vercel.' });
    return;
  }

  let payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      res.status(400).json({ error: 'Invalid JSON request.' });
      return;
    }
  }
  if (!payload || !payload.message) {
    res.status(400).json({ error: 'The request message is required.' });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const email = {
    from: sender,
    to: [recipient],
    subject: 'Nueva solicitud de cliente REQAPP',
    text: payload.message,
  };

  if (Array.isArray(payload.attachments) && payload.attachments.length > 0) {
    email.attachments = payload.attachments.map((attachment) => ({
      filename: attachment.filename,
      content: Buffer.from(attachment.content, 'base64'),
    }));
  }

  const { data, error } = await resend.emails.send(email);
  if (error) {
    console.error('Resend error:', error);
    res.status(502).json({ error: 'The request email could not be sent.' });
    return;
  }

  res.status(200).json({ id: data && data.id });
};
