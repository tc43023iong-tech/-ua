
import React from 'react';

interface BunnyProps {
  emotion: 'happy' | 'neutral' | 'jumping';
}

const Bunny: React.FC<BunnyProps> = ({ emotion }) => {
  return (
    <div className={`relative w-20 h-24 transition-all duration-300 ${emotion === 'jumping' ? '-translate-y-16 scale-110' : 'hover:scale-105'}`}>
      {/* Bunny Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-black/10 rounded-full blur-sm"></div>
      
      {/* Ears */}
      <div className={`absolute top-0 left-4 w-5 h-14 bg-white border-2 border-pink-100 rounded-full origin-bottom transition-transform duration-500 shadow-sm ${emotion === 'jumping' ? 'rotate-15' : '-rotate-6'}`}>
        <div className="w-2.5 h-10 bg-pink-50 rounded-full mx-auto mt-2 opacity-80"></div>
      </div>
      <div className={`absolute top-0 right-4 w-5 h-14 bg-white border-2 border-pink-100 rounded-full origin-bottom transition-transform duration-500 shadow-sm ${emotion === 'jumping' ? '-rotate-15' : 'rotate-6'}`}>
        <div className="w-2.5 h-10 bg-pink-50 rounded-full mx-auto mt-2 opacity-80"></div>
      </div>

      {/* Body/Face (White) */}
      <div className="absolute bottom-0 w-20 h-20 bg-white rounded-[2.5rem] border-2 border-pink-50 z-10 shadow-md overflow-hidden">
        {/* Face Details */}
        <div className="absolute top-8 left-0 w-full flex flex-col items-center gap-1">
          <div className="flex justify-center gap-5">
             {/* Eyes */}
             <div className={`w-2.5 h-2.5 bg-gray-800 rounded-full ${emotion === 'happy' ? 'animate-bounce' : ''}`}></div>
             <div className={`w-2.5 h-2.5 bg-gray-800 rounded-full ${emotion === 'happy' ? 'animate-bounce' : ''}`}></div>
          </div>
          
          {/* Nose & Mouth */}
          <div className="flex flex-col items-center -mt-1">
            <div className="w-2 h-1.5 bg-pink-400 rounded-full"></div>
            <div className="w-4 h-2 border-b-2 border-pink-200 rounded-full"></div>
          </div>
        </div>

        {/* Rosy Cheeks */}
        <div className="absolute top-10 left-3 w-4 h-2.5 bg-pink-200 rounded-full opacity-60 blur-[1px]"></div>
        <div className="absolute top-10 right-3 w-4 h-2.5 bg-pink-200 rounded-full opacity-60 blur-[1px]"></div>
      </div>
      
      {/* Tail */}
      <div className="absolute bottom-2 -left-2 w-6 h-6 bg-white border-2 border-pink-50 rounded-full z-0 shadow-sm"></div>
    </div>
  );
};

export default Bunny;
