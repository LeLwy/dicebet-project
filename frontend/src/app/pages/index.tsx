import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateGame = () => {
        navigate('/create-game');
    };

    const handleJoinGame = () => {
        navigate('/join-game');
    };

    return (
        <div>
            <h1>Page d&apos;accueil</h1>
            <button onClick={handleCreateGame}>Créer une partie</button>
            <button onClick={handleJoinGame}>Rejoindre une partie</button>
        </div>
    );
};

export default HomePage;