import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const text = await redis.get('clipboard_text');
    if (!text) return res.status(404).json({ error: 'No text available' });

    await redis.del('clipboard_text');
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: 'Redis failed', details: err.message });
  }
};
