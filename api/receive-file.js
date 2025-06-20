// --- receive-file.js ---
import { lastFile } from './upload.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (!lastFile) {
    return res.status(404).json({ error: 'Aucun fichier disponible' });
  }

  res.setHeader('Content-Disposition', `attachment; filename="${lastFile.filename}"`);
  res.setHeader('Content-Type', lastFile.mimetype);
  res.send(lastFile.content);

  // Nettoyage
  lastFile = null;
}
