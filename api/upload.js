import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
  },
};

let lastFile = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // ← ✅ TOUJOURS avant tout

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const busboy = Busboy({ headers: req.headers });
    let fileBuffer = Buffer.alloc(0);
    let fileInfo = null;

    await new Promise((resolve, reject) => {
      busboy.on('file', (name, file, info) => {
        const { filename, mimeType } = info;
        file.on('data', (data) => {
          fileBuffer = Buffer.concat([fileBuffer, data]);
        });
        file.on('end', () => {
          fileInfo = {
            filename,
            mimetype: mimeType,
            content: fileBuffer,
          };
        });
      });

      busboy.on('error', reject);
      busboy.on('finish', resolve);

      req.pipe(busboy);
    });

    if (!fileInfo) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }

    lastFile = fileInfo;

    return res.status(200).json({ status: 'fichier reçu', filename: lastFile.filename });
  } catch (err) {
    console.error('Erreur Busboy :', err);
    return res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
}
