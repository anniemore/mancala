
import React from 'react';
import Pit from './Pit';
import { Player, GameStatus } from '../types';
import { PLAYER_ONE_MANCALA, PLAYER_TWO_MANCALA } from '../constants';

interface BoardProps {
  board: number[];
  currentPlayer: Player;
  status: GameStatus;
  onPitClick: (index: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, currentPlayer, status, onPitClick }) => {
  const playerOnePits = board.slice(0, PLAYER_ONE_MANCALA);
  const playerTwoPits = board.slice(PLAYER_ONE_MANCALA + 1, PLAYER_TWO_MANCALA);

  const renderPits = (pits: number[], isPlayerOne: boolean) => {
    const pitIndices = isPlayerOne 
      ? Array.from({ length: pits.length }, (_, i) => i)
      : Array.from({ length: pits.length }, (_, i) => PLAYER_TWO_MANCALA - 1 - i);

    return pits.map((stones, i) => {
      const pitIndex = pitIndices[i];
      const isTurn = (isPlayerOne && currentPlayer === Player.One) || (!isPlayerOne && currentPlayer === Player.Two);
      const isClickable = isTurn && status === GameStatus.Playing && stones > 0;
      
      return (
        <Pit 
          key={pitIndex}
          stones={stones} 
          isMancala={false}
          isPlayerTurnAndClickable={isClickable}
          onClick={() => onPitClick(pitIndex)}
        />
      );
    });
  };

  return (
    <div className="bg-amber-800 p-4 sm:p-6 rounded-3xl shadow-2xl border-4 border-amber-900/50">
      <div className="grid grid-cols-8 grid-rows-2 gap-4 items-center">
        {/* Player 2 Mancala */}
        <div className="col-start-1 row-start-1 row-span-2 flex justify-center items-center">
            <Pit 
              stones={board[PLAYER_TWO_MANCALA] || 0} 
              isMancala={true} 
              isPlayerTurnAndClickable={false}
              onClick={() => {}}
            />
        </div>

        {/* Player 2 Pits (top row) */}
        <div className="col-start-2 col-span-6 grid grid-cols-6 gap-2 sm:gap-4">
          {renderPits([...playerTwoPits].reverse(), false)}
        </div>

        {/* Player 1 Pits (bottom row) */}
        <div className="col-start-2 col-span-6 grid grid-cols-6 gap-2 sm:gap-4">
          {renderPits(playerOnePits, true)}
        </div>

        {/* Player 1 Mancala */}
        <div className="col-start-8 row-start-1 row-span-2 flex justify-center items-center">
            <Pit 
              stones={board[PLAYER_ONE_MANCALA] || 0} 
              isMancala={true} 
              isPlayerTurnAndClickable={false}
              onClick={() => {}}
            />
        </div>
      </div>
    </div>
  );
};

export default Board;
