import { getLastFile, clearLastFile } from './upload.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const file = getLastFile();

  if (!file) {
    return res.status(404).json({ error: 'Aucun fichier disponible' });
  }

  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  res.setHeader('Content-Type', file.mimetype);
  res.send(file.content);

  clearLastFile(); // Vide après réception
}
