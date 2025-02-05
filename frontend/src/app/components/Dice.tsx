import React from 'react';

interface DiceProps {
  value: number;
}

const Dice: React.FC<DiceProps> = ({ value }) => {
  return (
    <div className="dice">
      <p>{value}</p>
    </div>
  );
};

export default Dice;