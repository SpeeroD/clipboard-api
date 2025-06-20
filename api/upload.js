import { IncomingMessage } from 'http';
import Busboy from 'busboy';
import { buffer } from 'stream/consumers';

export const config = {
  api: {
    bodyParser: false,
  },
};

let lastFile = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const bb = Busboy({ headers: req.headers });

  let fileInfo = null;
  let fileBuffer = Buffer.alloc(0);

  bb.on('file', (name, file, info) => {
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

  bb.on('finish', () => {
    if (!fileInfo) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }
    lastFile = fileInfo;
    res.status(200).json({ status: 'fichier reçu', filename: fileInfo.filename });
  });

  req.pipe(bb);
}
