import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

let lastFile = null;

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

  const form = formidable({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'Erreur lors du traitement du fichier' });
    }

    const file = files.file; // plus de [0]
    const tempPath = file.filepath || file.path;
    const buffer = fs.readFileSync(tempPath);

    lastFile = {
      filename: file.originalFilename || file.name,
      mimetype: file.mimetype || file.type,
      content: buffer,
    };

    res.status(200).json({ status: 'fichier reçu', filename: lastFile.filename });
  });
}
