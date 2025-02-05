"use client";

import React, { useState } from 'react';
import axios from 'axios';

const Bidding: React.FC = () => {
    const [bidAmount, setBidAmount] = useState<number>(0);

    const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(Number(event.target.value));
    };

    const placeBid = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/place-bid', { bidAmount });
            console.log(response.data.message);
            alert(response.data.message);
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Failed to place bid');
        }
    };

    return (
        <div>
            <h2>Place Your Bid</h2>
            <input 
                type="number" 
                value={bidAmount} 
                onChange={handleBidChange} 
                placeholder="Enter your bid amount" 
            />
            <button onClick={placeBid}>Place Bid</button>
        </div>
    );
};

export default Bidding;