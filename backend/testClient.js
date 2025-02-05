const { io } = require("socket.io-client");

const socket = io("http://localhost:3001", {
    transports: ["websocket"]
});

socket.on("connect", () => {
    console.log("✅ Connecté au serveur avec ID:", socket.id);

    socket.emit("obtenirParties", (response) => {
        if (response.length === 0) {
            console.log("📄 Il n'y a pas de parties disponibles.");
            socket.emit("creerPartie", "partieTest", (response) => {
                console.log("📄 Partie créée :", response);
            });
        } else {
            console.log("📄 Parties obtenues :", response);
        }
    });
});

socket.on("majPartie", (data) => {
    console.log("📩 Mise à jour de la partie :", data);
});

socket.on("disconnect", () => {
    console.log("❌ Déconnecté du serveur");
});
