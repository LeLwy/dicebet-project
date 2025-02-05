"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var express = require("express");
var http = require("http");
var socket_io_1 = require("socket.io");
var cors = require("cors");
dotenv.config();
var app = express();
var server = http.createServer(app); // Serveur HTTP pour WebSockets
// Configurer CORS
app.use(cors());
app.use(express.json());
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
var PORT = process.env.PORT || 3001;
io.on("connection", function (socket) {
    console.log("\uD83D\uDFE2 Joueur connect\u00E9 : ".concat(socket.id));
    socket.on("creerPartie", function (data) {
        var idPartie = data.idPartie, pseudo = data.pseudo;
        console.log("\uD83D\uDCCC Partie ".concat(idPartie, " cr\u00E9\u00E9e par ").concat(pseudo, " (").concat(socket.id, ")"));
        socket.join(idPartie);
        io.to(idPartie).emit("message", "".concat(pseudo, " a cr\u00E9\u00E9 la partie ").concat(idPartie));
    });
    socket.on("rejoindrePartie", function (data) {
        var idPartie = data.idPartie, pseudo = data.pseudo;
        console.log("\uD83D\uDCCC ".concat(pseudo, " a rejoint la partie ").concat(idPartie));
        socket.join(idPartie);
        io.to(idPartie).emit("message", "".concat(pseudo, " a rejoint la partie"));
    });
    socket.on("disconnect", function () {
        console.log("\uD83D\uDD34 Joueur d\u00E9connect\u00E9 : ".concat(socket.id));
    });
});
app.post('/api/place-bid', function (req, res) {
    var bidAmount = req.body.bidAmount;
    console.log("Bid received: ".concat(bidAmount));
    res.status(200).send({ message: "Bid of ".concat(bidAmount, " has been placed successfully!") });
});
server.listen(PORT, function () {
    console.log("Backend server is running on http://localhost:".concat(PORT));
});
