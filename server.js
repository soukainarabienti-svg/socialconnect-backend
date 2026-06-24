const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let messages = [];
let statuses = [];

// === ROUTES POUR LES MESSAGES ===
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

app.post('/api/messages', (req, res) => {
    const { sender, text } = req.body;
    if (!sender || !text) {
        return res.status(400).json({ error: "Champs manquants" });
    }
    const newMessage = { sender, text, createdAt: new Date() };
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

// === ROUTES POUR LES STATUTS ===
app.get('/api/statuses', (req, res) => {
    res.json(statuses);
});

app.post('/api/statuses', (req, res) => {
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ error: "Champs manquants" });
    }
    const newStatus = { author, content, createdAt: new Date() };
    statuses.unshift(newStatus);
    res.status(201).json(newStatus);
});

app.listen(PORT, () => {
    console.log(`Serveur SocialConnect en ligne sur le port ${PORT}`);
});
