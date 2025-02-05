import * as dotenv from 'dotenv';
import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import * as cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app); // Serveur HTTP pour WebSockets

// Configurer CORS
app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*", // Permettre toutes les connexions (vous pouvez restreindre cela en production)
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
    console.log(`🟢 Joueur connecté : ${socket.id}`);

    socket.on("creerPartie", (data) => {
        const { idPartie, pseudo } = data;
        console.log(`📌 Partie ${idPartie} créée par ${pseudo} (${socket.id})`);
        socket.join(idPartie);
        io.to(idPartie).emit("message", `${pseudo} a créé la partie ${idPartie}`);
    });

    socket.on("rejoindrePartie", (data) => {
        const { idPartie, pseudo } = data;
        console.log(`📌 ${pseudo} a rejoint la partie ${idPartie}`);
        socket.join(idPartie);
        io.to(idPartie).emit("message", `${pseudo} a rejoint la partie`);
    });

    socket.on("disconnect", () => {
        console.log(`🔴 Joueur déconnecté : ${socket.id}`);
    });
});

app.post('/api/place-bid', (req, res) => {
    const { bidAmount } = req.body;
    console.log(`Bid received: ${bidAmount}`);
    res.status(200).send({ message: `Bid of ${bidAmount} has been placed successfully!` });
});

server.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});