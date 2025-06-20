// --- upload.js ---
// Reçoit un fichier via multipart/form-data et le stocke en mémoire

import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Variable temporaire partagée
export let lastFile = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const form = formidable({ keepExtensions: true, multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'Erreur lors du traitement du fichier' });
    }

    const file = files.file[0];
    const buffer = fs.readFileSync(file.filepath);

    lastFile = {
      filename: file.originalFilename,
      mimetype: file.mimetype,
      content: buffer,
    };

    res.status(200).json({ status: 'fichier reçu', filename: file.originalFilename });
  });
}
