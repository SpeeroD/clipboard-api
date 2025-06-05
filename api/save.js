let latestData = null;

export default function handler(req, res) {
  if (req.method === 'POST') {
    latestData = req.body;
    return res.status(200).json({ message: 'Donnée reçue.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(latestData || {});
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

