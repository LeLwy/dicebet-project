require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const gestionJeu = require('./gestionJeu');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
  console.log(`Joueur connecté : ${socket.id}`);

  socket.on('creerPartie', (idPartie) => {
    gestionJeu.creerPartie(idPartie, socket.id);
    socket.join(idPartie);
    console.log(`Partie ${idPartie} créée par ${socket.id}`);
  });

  socket.on('rejoindrePartie', (idPartie) => {
    gestionJeu.rejoindrePartie(idPartie, socket.id);
    socket.join(idPartie);
    io.to(idPartie).emit('majPartie', gestionJeu.obtenirPartie(idPartie));
  });

  socket.on('demarrerPartie', (idPartie) => {
    gestionJeu.demarrerPartie(idPartie);
    io.to(idPartie).emit('majPartie', gestionJeu.obtenirPartie(idPartie));
  });

  socket.on('disconnect', () => {
    console.log(`Joueur déconnecté : ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
