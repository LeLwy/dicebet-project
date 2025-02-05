import React, { useState } from 'react';

const Bidding: React.FC = () => {
    const [bidAmount, setBidAmount] = useState<number>(0);

    const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(Number(event.target.value));
    };

    const placeBid = () => {
        console.log(`Bid placed: ${bidAmount}`);
        // Add logic to handle bid placement
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