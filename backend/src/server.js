/**
 * @fileoverview Main server file for the dicebet project backend.
 * Sets up an Express server with Socket.io for real-time communication.
 * Handles game management and player interactions.
 */

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
  /**
   * Event listener for new socket connections.
   * @param {Socket} socket - The connected socket instance.
   */
  console.log(`🟢 Jugador conectado: ${socket.id}`);

  /**
   * Emit the list of ongoing games to the connected player.
   */
  socket.emit("listeParties", gestionJeu.obtenirPartiesEnCours());

  /**
   * Event listener for creating a new game.
   * @param {string} idPartie - The ID of the game to be created.
   */
  socket.on("creerPartie", (idPartie) => {
    if (!idPartie) return;
    gestionJeu.creerPartie(idPartie, socket.id);
    io.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
  });

  /**
   * Event listener for obtaining the list of ongoing games.
   */
  socket.on("obtenirParties", () => {
    socket.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
  });

  /**
   * Event listener for joining an existing game.
   * @param {string} idPartie - The ID of the game to join.
   */
  socket.on("rejoindrePartie", (idPartie) => {
    gestionJeu.rejoindrePartie(idPartie, socket.id, socket.id);
    io.emit("listeParties", gestionJeu.obtenirPartiesEnCours());
  });

  /**
   * Event listener for starting a game.
   * @param {string} idPartie - The ID of the game to start.
   */
  socket.on("demarrerPartie", (idPartie) => {
    console.log(`🚀 Démarrage de la partie: ${idPartie}`);
    if (gestionJeu.demarrerPartie(idPartie)) {
      const partie = gestionJeu.obtenirPartie(idPartie);
      if (!partie) {
        console.error(`❌ ERREUR: Partie ${idPartie} introuvable.`);
        return;
      }
      // Send dice to each player with a small delay
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

  /**
   * Event listener for placing a bet.
   * @param {Object} bet - The bet details.
   * @param {string} bet.idPartie - The ID of the game.
   * @param {string} bet.joueur - The player placing the bet.
   * @param {number} bet.valeur - The value of the bet.
   * @param {number} bet.quantite - The quantity of the bet.
   */
  socket.on("fairePari", ({ idPartie, joueur, valeur, quantite }) => {
    if (gestionJeu.fairePari(idPartie, joueur, valeur, quantite)) {
      io.emit("majPartie", gestionJeu.obtenirPartie(idPartie));
    }
  });

  /**
   * Event listener for doubting a bet.
   * @param {string} idPartie - The ID of the game.
   * @param {string} joueur - The player doubting the bet.
   */
  socket.on("douter", (idPartie, joueur) => {
    const gagnant = gestionJeu.douter(idPartie, joueur);
    if (gagnant) {
      io.emit("partieTerminee", { gagnant });
    } else {
      io.emit("majPartie", gestionJeu.obtenirPartie(idPartie));
    }
  });

  /**
   * Event listener for socket disconnection.
   */
  socket.on("disconnect", () => {
    console.log(`🔴 Jugador desconectado: ${socket.id}`);
  });
});

/**
 * Start the server and listen on the specified port.
 */
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
