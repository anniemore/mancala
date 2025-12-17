
import React from 'react';

interface StoneProps {
  colorClass: string;
}

const Stone: React.FC<StoneProps> = ({ colorClass }) => (
  <div className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full ${colorClass} border-2 border-white/30 shadow-inner`}></div>
);

export default Stone;
