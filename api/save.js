import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const text = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    await redis.set('clipboard_text', text);
    return res.status(200).json({ status: 'saved' });

  } catch (err) {
    return res.status(500).json({ error: 'Redis failed', details: err.message });
  }
};
