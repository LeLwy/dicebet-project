
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameContextProps {
  children: ReactNode;
}

interface GameState {
  dice: number[];
  bids: { player: string; bid: number }[];
  currentPlayer: string;
}

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<GameContextProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    dice: [],
    bids: [],
    currentPlayer: '',
  });

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};