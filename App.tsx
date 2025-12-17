
import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import GameStatusDisplay from './components/GameStatusDisplay';
import { Player, GameStatus } from './types';
import { 
  PITS_PER_PLAYER, 
  INITIAL_STONES_PER_PIT, 
  PLAYER_ONE_MANCALA, 
  PLAYER_TWO_MANCALA, 
  TOTAL_PITS 
} from './constants';

const App: React.FC = () => {
  const [board, setBoard] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.One);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

  const initializeBoard = useCallback(() => {
    const newBoard = new Array(TOTAL_PITS).fill(0);
    for (let i = 0; i < TOTAL_PITS; i++) {
      if (i !== PLAYER_ONE_MANCALA && i !== PLAYER_TWO_MANCALA) {
        newBoard[i] = INITIAL_STONES_PER_PIT;
      }
    }
    setBoard(newBoard);
    setCurrentPlayer(Player.One);
    setStatus(GameStatus.Playing);
    setWinner(null);
  }, []);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);
  
  const checkGameOver = (currentBoard: number[]): boolean => {
    const playerOnePits = currentBoard.slice(0, PLAYER_ONE_MANCALA);
    const playerTwoPits = currentBoard.slice(PLAYER_ONE_MANCALA + 1, PLAYER_TWO_MANCALA);
    
    const isPlayerOneSideEmpty = playerOnePits.every(stones => stones === 0);
    const isPlayerTwoSideEmpty = playerTwoPits.every(stones => stones === 0);

    if (isPlayerOneSideEmpty || isPlayerTwoSideEmpty) {
      const finalBoard = [...currentBoard];
      const playerOneRemaining = playerOnePits.reduce((sum, stones) => sum + stones, 0);
      const playerTwoRemaining = playerTwoPits.reduce((sum, stones) => sum + stones, 0);

      for(let i = 0; i < PLAYER_ONE_MANCALA; i++) finalBoard[i] = 0;
      for(let i = PLAYER_ONE_MANCALA + 1; i < PLAYER_TWO_MANCALA; i++) finalBoard[i] = 0;

      finalBoard[PLAYER_ONE_MANCALA] += playerOneRemaining;
      finalBoard[PLAYER_TWO_MANCALA] += playerTwoRemaining;
      
      setBoard(finalBoard);
      setStatus(GameStatus.GameOver);

      if (finalBoard[PLAYER_ONE_MANCALA] > finalBoard[PLAYER_TWO_MANCALA]) {
        setWinner(Player.One);
      } else if (finalBoard[PLAYER_TWO_MANCALA] > finalBoard[PLAYER_ONE_MANCALA]) {
        setWinner(Player.Two);
      } else {
        setWinner('Draw');
      }
      return true;
    }
    return false;
  };


  const handlePitClick = (index: number) => {
    if (status === GameStatus.GameOver || board[index] === 0) {
      return;
    }

    if (currentPlayer === Player.One && index >= PLAYER_ONE_MANCALA) {
      return;
    }
    if (currentPlayer === Player.Two && index < PLAYER_ONE_MANCALA + 1) {
      return;
    }

    let newBoard = [...board];
    let stones = newBoard[index];
    newBoard[index] = 0;

    let currentPit = index;
    while (stones > 0) {
      currentPit = (currentPit + 1) % TOTAL_PITS;
      if (currentPlayer === Player.One && currentPit === PLAYER_TWO_MANCALA) {
        continue;
      }
      if (currentPlayer === Player.Two && currentPit === PLAYER_ONE_MANCALA) {
        continue;
      }
      newBoard[currentPit]++;
      stones--;
    }

    // Capture rule
    const lastPitIsOnPlayerSide = (currentPlayer === Player.One && currentPit < PLAYER_ONE_MANCALA) ||
                                (currentPlayer === Player.Two && currentPit > PLAYER_ONE_MANCALA && currentPit < PLAYER_TWO_MANCALA);
    
    if (lastPitIsOnPlayerSide && newBoard[currentPit] === 1) {
      const oppositePitIndex = (TOTAL_PITS - 2) - currentPit;
      if (newBoard[oppositePitIndex] > 0) {
        const capturedStones = newBoard[oppositePitIndex] + 1;
        newBoard[oppositePitIndex] = 0;
        newBoard[currentPit] = 0;
        
        const mancalaIndex = currentPlayer === Player.One ? PLAYER_ONE_MANCALA : PLAYER_TWO_MANCALA;
        newBoard[mancalaIndex] += capturedStones;
      }
    }

    setBoard(newBoard);
    
    if(checkGameOver(newBoard)) return;

    // Go again rule
    const lastPitIsPlayersMancala = (currentPlayer === Player.One && currentPit === PLAYER_ONE_MANCALA) ||
                                  (currentPlayer === Player.Two && currentPit === PLAYER_TWO_MANCALA);

    if (!lastPitIsPlayersMancala) {
      setCurrentPlayer(currentPlayer === Player.One ? Player.Two : Player.One);
    }
  };

  return (
    <main className="bg-amber-100 min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4 tracking-wider">Mancala</h1>
        <GameStatusDisplay 
          status={status} 
          currentPlayer={currentPlayer} 
          winner={winner} 
        />
        <Board 
          board={board} 
          currentPlayer={currentPlayer} 
          status={status}
          onPitClick={handlePitClick}
        />
        <button 
          onClick={initializeBoard}
          className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400"
        >
          New Game
        </button>
      </div>
    </main>
  );
};

export default App;
