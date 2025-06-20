import { NextResponse } from 'next/server';

let lastFile = null;

export async function GET(req) {
  if (!lastFile) {
    return NextResponse.json({ error: 'Aucun fichier disponible' }, { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Disposition', `attachment; filename="${lastFile.filename}"`);
  headers.set('Content-Type', lastFile.mimetype);

  const response = new Response(lastFile.content, { headers });
  lastFile = null; // On efface le fichier après téléchargement
  return response;
}
