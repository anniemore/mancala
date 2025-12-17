
import React from 'react';
import Stone from './Stone';

interface PitProps {
  stones: number;
  isMancala: boolean;
  isPlayerTurnAndClickable: boolean;
  onClick: () => void;
}

const Pit: React.FC<PitProps> = ({ stones, isMancala, isPlayerTurnAndClickable, onClick }) => {
  const stoneColors = [
    'bg-sky-500', 'bg-red-500', 'bg-emerald-500', 'bg-amber-500', 
    'bg-violet-500', 'bg-rose-500', 'bg-teal-500', 'bg-orange-500'
  ];

  const baseClasses = "relative rounded-full flex items-center justify-center transition-all duration-300 shadow-inner";
  const mancalaClasses = "w-24 h-full rounded-3xl col-span-1 row-span-2 bg-amber-900/70";
  const pitClasses = "w-20 h-20 sm:w-24 sm:h-24 bg-amber-900/60";
  
  const clickableClasses = isPlayerTurnAndClickable 
    ? "cursor-pointer transform hover:scale-105 hover:bg-amber-900/80 ring-4 ring-amber-400 ring-offset-4 ring-offset-amber-800" 
    : "cursor-default";

  const containerClasses = isMancala
    ? `${baseClasses} ${mancalaClasses}`
    : `${baseClasses} ${pitClasses} ${clickableClasses}`;

  return (
    <div onClick={isPlayerTurnAndClickable ? onClick : undefined} className={containerClasses}>
      <span className={`absolute ${isMancala ? 'top-2 text-xl' : 'top-0 right-1 text-lg'} font-bold text-white drop-shadow-md`}>
        {stones}
      </span>
      <div className={`flex flex-wrap items-center justify-center gap-1 p-2 ${isMancala ? 'flex-col h-full' : ''}`}>
        {Array.from({ length: Math.min(stones, 16) }).map((_, i) => (
           <Stone key={i} colorClass={stoneColors[i % stoneColors.length]} />
        ))}
      </div>
    </div>
  );
};

export default Pit;
