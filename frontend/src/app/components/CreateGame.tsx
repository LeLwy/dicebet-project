"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const CreateGame: React.FC = () => {
    const [pseudo, setPseudo] = useState<string>('');
    const router = useRouter();

    const handleCreateGame = () => {
        const idPartie = Math.random().toString(36).substr(2, 9);
        socket.emit('creerPartie', { idPartie, pseudo });
        router.push(`/game/${idPartie}`);
    };

    return (
        <div>
            <h2>Créer une partie</h2>
            <input 
                type="text" 
                value={pseudo} 
                onChange={(e) => setPseudo(e.target.value)} 
                placeholder="Entrez votre pseudo" 
            />
            <button onClick={handleCreateGame}>Créer une partie</button>
        </div>
    );
};

export default CreateGame;