const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let messages = [];
let statuses = [];
let activeOTPs = {}; 

// ================= ROUTES D'AUTHENTIFICATION (SMS OTP) =================

app.post('/api/auth/send-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: "Numéro de téléphone requis" });
    }

    // Générer un code fictif à 6 chiffres
    const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
    activeOTPs[phone] = mockOTP;

    // S'affichera dans tes logs Render
    console.log(`[SMS OTP] Code ${mockOTP} généré pour le numéro : ${phone}`);

    res.status(200).json({ success: true, message: "Code OTP généré avec succès (consultez vos logs serveur)." });
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) {
        return res.status(400).json({ error: "Champs manquants" });
    }

    if (activeOTPs[phone] && activeOTPs[phone] === code) {
        delete activeOTPs[phone]; 
        return res.status(200).json({ success: true, message: "Numéro vérifié avec succès !" });
    } else {
        return res.status(400).json({ error: "Code OTP invalide ou expiré" });
    }
});

// ================= ROUTES POUR LES MESSAGES =================
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

app.post('/api/messages', (req, res) => {
    const { sender, text } = req.body;
    if (!sender || !text) return res.status(400).json({ error: "Champs manquants" });
    
    const newMessage = { sender, text, createdAt: new Date() };
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

// ================= ROUTES POUR LES STATUTS =================
app.get('/api/statuses', (req, res) => {
    res.json(statuses);
});

app.post('/api/statuses', (req, res) => {
    const { author, content } = req.body;
    if (!author || !content) return res.status(400).json({ error: "Champs manquants" });

    const newStatus = { author, content, createdAt: new Date() };
    statuses.unshift(newStatus);
    res.status(201).json(newStatus);
});

app.listen(PORT, () => {
    console.log(`Serveur SocialConnect en ligne sur le port ${PORT}`);
});
