export default async function handler(req, res) {
  if (req.method === "POST") {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // nom dynamique basé sur la date
    const fs = require("fs");
    const path = require("path");
    const filename = `file_${Date.now()}.bin`;
    fs.writeFileSync(path.join("/tmp", filename), buffer);

    console.log(`✅ Fichier reçu et enregistré sous ${filename}`);
    return res.status(200).json({ message: "Fichier reçu", filename });
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}
