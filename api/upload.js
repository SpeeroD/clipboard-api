import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

let lastFile = null;

// Fonction pour exposer lastFile à d'autres modules
export function getLastFile() {
  return lastFile;
}

export function clearLastFile() {
  lastFile = null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'Erreur lors du traitement du fichier' });
    }

    const file = files.file[0];
    const tempPath = file.filepath;
    const buffer = fs.readFileSync(tempPath);

    lastFile = {
      filename: file.originalFilename,
      mimetype: file.mimetype,
      content: buffer,
    };

    res.status(200).json({ status: 'fichier reçu', filename: lastFile.filename });
  });
}
