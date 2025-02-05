const { io } = require("socket.io-client");

const socket = io("http://localhost:3001", {
    transports: ["websocket"]
});

socket.on("connect", () => {
    console.log("✅ Connecté au serveur avec ID:", socket.id);

    // Enviar evento de creación de partida
    socket.emit("creerPartie", "partieTest");
});

socket.on("majPartie", (data) => {
    console.log("📩 Mise à jour de la partie :", data);
});

socket.on("disconnect", () => {
    console.log("❌ Déconnecté du serveur");
});
