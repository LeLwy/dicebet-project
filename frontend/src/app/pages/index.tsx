"use client";

import React from 'react';
import CreateGame from '../components/CreateGame';
import JoinGame from '../components/JoinGame';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Page d&apos;accueil</h1>
            <CreateGame />
            <JoinGame />
        </div>
    );
};

export default HomePage;