let latestData = null;

const handler = (req, res) => {
  if (req.method === 'POST') {
    latestData = req.body;
    return res.status(200).json({ message: 'Donnée reçue.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(latestData || {});
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
};

// Simuler un GET
handler({ method: 'GET' }, { status: code => ({ json: obj => console.log(code, obj) }) });
