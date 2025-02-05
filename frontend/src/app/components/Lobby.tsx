import React, { useState } from 'react';

interface Game {
    id: number;
    name: string;
}

const Lobby: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [newGameName, setNewGameName] = useState<string>('');

    const createGame = () => {
        const newGame: Game = {
            id: games.length + 1,
            name: newGameName,
        };
        setGames([...games, newGame]);
        setNewGameName('');
    };

    return (
        <div>
            <h1>Lobby</h1>
            <div>
                <input
                    type="text"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    placeholder="Enter game name"
                />
                <button onClick={createGame}>Create Game</button>
            </div>
            <div>
                <h2>Available Games</h2>
                <ul>
                    {games.map((game) => (
                        <li key={game.id}>{game.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Lobby;