import React from 'react';

interface BunnyProps {
  emotion: 'happy' | 'neutral' | 'jumping';
}

const Bunny: React.FC<BunnyProps> = ({ emotion }) => {
  return (
    <div className={`relative w-16 h-16 transition-transform duration-300 ${emotion === 'jumping' ? '-translate-y-8' : ''}`}>
      {/* Body */}
      <div className="absolute bottom-0 w-12 h-14 bg-white rounded-t-3xl rounded-b-2xl border-2 border-gray-200 left-2 z-10 shadow-sm"></div>
      
      {/* Ears */}
      <div className={`absolute -top-4 left-3 w-3 h-10 bg-white border-2 border-gray-200 rounded-full origin-bottom transition-transform ${emotion === 'jumping' ? 'rotate-12' : '-rotate-6'}`}>
        <div className="w-1.5 h-6 bg-pink-200 rounded-full mx-auto mt-1 opacity-60"></div>
      </div>
      <div className={`absolute -top-4 right-5 w-3 h-10 bg-white border-2 border-gray-200 rounded-full origin-bottom transition-transform ${emotion === 'jumping' ? '-rotate-12' : 'rotate-6'}`}>
        <div className="w-1.5 h-6 bg-pink-200 rounded-full mx-auto mt-1 opacity-60"></div>
      </div>

      {/* Face */}
      <div className="absolute bottom-6 left-4 z-20 w-8 flex justify-between px-1">
         {/* Eyes */}
         <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
         <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
      </div>
      
      {/* Nose */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-1 h-1 bg-pink-400 rounded-full"></div>

      {/* Cheeks */}
      <div className="absolute bottom-4 left-3 z-20 w-2 h-1 bg-pink-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-4 right-5 z-20 w-2 h-1 bg-pink-200 rounded-full opacity-50"></div>
    </div>
  );
};

export default Bunny;