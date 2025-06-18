import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send("Méthode non autorisée");
  }

  const form = new IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Erreur de parsing :", err);
      return res.status(500).json({ error: "Erreur de parsing" });
    }

    const file = files.file;

    if (!file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    return res.status(200).json({
      filename: file[0]?.originalFilename,
      mimetype: file[0]?.mimetype,
      size: file[0]?.size,
      message: "✅ Fichier reçu avec succès"
    });
  });
}
