"use client";

import React, { useState } from 'react';
import axios from 'axios';

const GameBoard: React.FC = () => {
    const [dice, setDice] = useState<number[]>([1, 2, 3, 4, 5]);
    const [bid, setBid] = useState<number>(0);

    const rollDice = () => {
        const newDice = dice.map(() => Math.floor(Math.random() * 6) + 1);
        setDice(newDice);
    };

    const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBid(Number(event.target.value));
    };

    const placeBid = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/place-bid', { bidAmount: bid });
            console.log(response.data.message);
            alert(response.data.message);
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Failed to place bid');
        }
    };

    return (
        <div>
            <h1>Plateau de jeu</h1>
            <div>
                {dice.map((die, index) => (
                    <span key={index} style={{ margin: '0 10px', fontSize: '24px' }}>
                        {die}
                    </span>
                ))}
            </div>
            <button onClick={rollDice}>Roll Dice</button>
            <div>
                <label>
                    Enchère:
                    <input 
                        type="number" 
                        value={bid} 
                        onChange={handleBidChange} 
                        placeholder="Enter your bid amount" 
                    />
                </label>
                <button onClick={placeBid}>Place Bid</button>
            </div>
        </div>
    );
};

export default GameBoard;