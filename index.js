const express = require("express");
const formidable = require("formidable");
const app = express();
const PORT = 3000;

let lastText = null;
let lastFile = null;

app.use(express.text({ type: "*/*" }));

// Texte envoyé depuis iPhone
app.post("/api/save", (req, res) => {
  lastText = req.body;
  console.log("Texte reçu :", lastText);
  res.json({ status: "ok" });
});

// Récupération du texte sur PC
app.get("/api/receive-text", (req, res) => {
  if (!lastText) return res.status(404).json({ error: "Aucun texte dispo" });
  const result = lastText;
  lastText = null;
  res.json({ text: result });
});

// Fichier (image, pdf…) envoyé depuis iPhone
app.post("/api/upload", (req, res) => {
  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err || !files.file) return res.status(400).json({ error: "Erreur fichier" });

    lastFile = {
      filepath: files.file[0].filepath,
      mimetype: files.file[0].mimetype,
      filename: files.file[0].originalFilename,
    };
    console.log("Fichier reçu :", lastFile.filename);
    res.json({ status: "ok" });
  });
});

// Récupération du fichier sur PC
app.get("/api/receive-file", (req, res) => {
  if (!lastFile) return res.status(404).json({ error: "Aucun fichier dispo" });

  res.download(lastFile.filepath, lastFile.filename, (err) => {
    if (err) console.error("Erreur download :", err);
    lastFile = null; // Supprime après envoi
  });
});

app.listen(PORT, () => console.log(`✅ API démarrée sur http://localhost:${PORT}`));
