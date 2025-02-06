// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const gestionJeu = require("./gestionJeu");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
  console.log(`🟢 Jugador conectado: ${socket.id}`);

  socket.emit("listeParties", gestionJeu.obtenirPartiesEnCours());

  socket.on("creerPartie", (idPartie) => {
    if (!idPartie) return;
    gestionJeu.creerPartie(idPartie, socket.id);
    io.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
  });

  socket.on("obtenirParties", () => {
    socket.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
  });

  socket.on("rejoindrePartie", (idPartie) => {
    gestionJeu.rejoindrePartie(idPartie, socket.id, socket.id);
    io.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
  });

  socket.on("demarrerPartie", (idPartie) => {
    console.log(`🚀 Démarrage de la partie: ${idPartie}`);
    if (gestionJeu.demarrerPartie(idPartie)) {
      const partie = gestionJeu.obtenirPartie(idPartie);
      if (!partie) {
        console.error(`❌ ERREUR: Partie ${idPartie} introuvable.`);
        return;
      }
      // Envoyer les dés à chaque joueur avec un petit délai
      Object.entries(partie.joueurs).forEach(([joueur, data]) => {
        if (!data.socketId) return;
        const desJoueur = gestionJeu.obtenirDesJoueur(idPartie, joueur);
        setTimeout(() => {
          io.to(data.socketId).emit("miseAJourDes", desJoueur);
          console.log(`✅ "miseAJourDes" envoyé à ${data.socketId} avec:`, desJoueur);
        }, 100);
      });
      io.emit("majPartie", partie);
    } else {
      console.log(`⛔ La partie ${idPartie} ne peut pas démarrer.`);
    }
  });

  socket.on("fairePari", ({ idPartie, joueur, valeur, quantite }) => {
    if (gestionJeu.fairePari(idPartie, joueur, valeur, quantite)) {
      io.emit("majPartie", gestionJeu.obtenirPartie(idPartie));
    }
  });

  socket.on("douter", (idPartie, joueur) => {
    const gagnant = gestionJeu.douter(idPartie, joueur);
    if (gagnant) {
      io.emit("partieTerminee", { gagnant });
    } else {
      io.emit("majPartie", gestionJeu.obtenirPartie(idPartie));
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Jugador desconectado: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
