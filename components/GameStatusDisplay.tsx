
import React from 'react';
import { Player, GameStatus } from '../types';

interface GameStatusDisplayProps {
  status: GameStatus;
  currentPlayer: Player;
  winner: Player | 'Draw' | null;
}

const GameStatusDisplay: React.FC<GameStatusDisplayProps> = ({ status, currentPlayer, winner }) => {
  const getMessage = () => {
    if (status === GameStatus.GameOver) {
      if (winner === 'Draw') {
        return "It's a Draw!";
      }
      return `${winner} Wins!`;
    }
    return `${currentPlayer}'s Turn`;
  };

  const playerOneColor = currentPlayer === Player.One && status === GameStatus.Playing ? 'text-blue-600' : 'text-gray-500';
  const playerTwoColor = currentPlayer === Player.Two && status === GameStatus.Playing ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="w-full max-w-md text-center p-4 mb-4 bg-amber-200/70 rounded-xl shadow-md">
      <div className="flex justify-between items-center text-xl font-bold">
        <span className={`transition-colors duration-300 ${playerOneColor}`}>Player 1</span>
        <span className={`transition-colors duration-300 ${playerTwoColor}`}>Player 2</span>
      </div>
      <p className="text-2xl font-bold mt-2 text-amber-900 min-h-[36px]">{getMessage()}</p>
    </div>
  );
};

export default GameStatusDisplay;
