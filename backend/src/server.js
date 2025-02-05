require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const gestionJeu = require('./gestionJeu');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
    console.log(`🟢 Joueur connecté : ${socket.id}`);

    socket.on("creerPartie", (idPartie) => {
        gestionJeu.creerPartie(idPartie, socket.id);
        io.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
    });

    socket.on("obtenirParties", () => {
        socket.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
    });

    socket.on("rejoindrePartie", (idPartie) => {
        gestionJeu.rejoindrePartie(idPartie, socket.id);
        io.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
    });

    socket.on("demarrerPartie", (idPartie) => {
        if (gestionJeu.demarrerPartie(idPartie)) {
            io.to(idPartie).emit("majPartie", gestionJeu.obtenirPartie(idPartie));
        }
    });

    socket.on("fairePari", ({ idPartie, joueur, valeur, quantite }) => {
        if (gestionJeu.fairePari(idPartie, joueur, valeur, quantite)) {
            io.to(idPartie).emit("majPartie", gestionJeu.obtenirPartie(idPartie));
        }
    });

    socket.on("douter", (idPartie, joueur) => {
        if (gestionJeu.douter(idPartie, joueur)) {
            const gagnant = gestionJeu.verifierFinPartie(idPartie);
            if (gagnant) {
                io.to(idPartie).emit("partieTerminee", { gagnant });
            } else {
                io.to(idPartie).emit("majPartie", gestionJeu.obtenirPartie(idPartie));
            }
        }
    });    

    socket.on("disconnect", () => {
        console.log(`🔴 Joueur déconnecté : ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
