"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const JoinGame: React.FC = () => {
    const [pseudo, setPseudo] = useState<string>('');
    const [gameId, setGameId] = useState<string>('');
    const router = useRouter();

    const handleJoinGame = () => {
        socket.emit('rejoindrePartie', { idPartie: gameId, pseudo });
        router.push(`/game/${gameId}`);
    };

    return (
        <div>
            <h2>Rejoindre une partie</h2>
            <input 
                type="text" 
                value={pseudo} 
                onChange={(e) => setPseudo(e.target.value)} 
                placeholder="Entrez votre pseudo" 
            />
            <input 
                type="text" 
                value={gameId} 
                onChange={(e) => setGameId(e.target.value)} 
                placeholder="Entrez l'ID de la partie" 
            />
            <button onClick={handleJoinGame}>Rejoindre une partie</button>
        </div>
    );
};

export default JoinGame;