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

  // Pas de fichier à récupérer : ici on force une réponse contrôlée
  return res.status(404).json({ error: 'Aucun fichier disponible (test)' });
}
