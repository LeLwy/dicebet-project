require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app); // ⬅️ Servidor HTTP para WebSockets

// Configurar CORS
app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*", // Permitir todas las conexiones (puedes restringirlo en producción)
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
    console.log(`🟢 Joueur connecté : ${socket.id}`);

    socket.on("creerPartie", (idPartie) => {
        console.log(`📌 Partie ${idPartie} créée par ${socket.id}`);
    });

    socket.on("disconnect", () => {
        console.log(`🔴 Joueur déconnecté : ${socket.id}`);
    });
});

socket.on("obtenirParties", () => {
    const parties = gestionJeu.obtenirPartiesEnCours();
    socket.emit("listeParties", parties);
});

server.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
