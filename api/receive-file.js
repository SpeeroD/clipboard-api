export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!lastFile) return res.status(404).json({ error: 'Aucun fichier disponible' });

  res.setHeader('Content-Disposition', `attachment; filename="${lastFile.filename}"`);
  res.setHeader('Content-Type', lastFile.mimetype);
  res.send(lastFile.content);

  lastFile = null; // Supprime après lecture
};


// --- 5. SCRIPT PC pour récupérer une image ---
// get_file.js

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const FILE_URL = 'https://clipboard-1n60yyqjb-speerods-projects.vercel.app/api/receive-file';

async function downloadFile() {
  try {
    const res = await fetch(FILE_URL);
    if (!res.ok) throw new Error('Aucun fichier dispo ou erreur');

    const contentDisposition = res.headers.get('content-disposition');
    const match = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
    const filename = match ? match[1] : 'fichier.jpg';
    const buffer = await res.buffer();
    const filePath = path.join('./', filename);

    fs.writeFileSync(filePath, buffer);
    console.log('📁 Fichier téléchargé :', filename);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
  }
}

downloadFile();
