import formidable from 'formidable-serverless';

export const config = {
  api: {
    bodyParser: false, // On désactive le bodyParser de Vercel
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur de parsing' });
    }

    const file = files.file;

    if (!file) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }

    // Exemple : envoyer le nom + type + taille du fichier
    return res.status(200).json({
      filename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      message: "Fichier reçu avec succès"
    });
  });
}
