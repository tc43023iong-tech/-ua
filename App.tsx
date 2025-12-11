import React, { useState, useEffect, useRef } from 'react';
import { TARGET_RHYMES, GameState, Question, Level } from './types';
import { generateGameContent } from './services/geminiService';
import Bunny from './components/Bunny';
import GameModal from './components/GameModal';
import { Play, RotateCcw, PartyPopper, ArrowRight, Music, Info, Check } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bunnyEmotion, setBunnyEmotion] = useState<'happy' | 'neutral' | 'jumping'>('neutral');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Game
  const startGame = async () => {
    setLoading(true);
    // Request questions equal to the number of rhymes
    const questions = await generateGameContent(TARGET_RHYMES.length);
    const newLevels = questions.map((q, idx) => ({
      id: idx,
      question: q,
      isCompleted: false
    }));
    
    setLevels(newLevels);
    setCurrentLevelIndex(0);
    setGameState(GameState.PLAYING);
    setLoading(false);
    
    // Auto-scroll to start
    setTimeout(() => {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
    }, 100);
  };

  const handleStoneClick = (index: number) => {
    // Only allow clicking the next available level
    if (index === currentLevelIndex) {
      setShowModal(true);
    }
  };

  const handleAnswer = (correct: boolean) => {
    // Proceed regardless of correct/wrong answer
    setShowModal(false);
    setBunnyEmotion('jumping');
    
    // Update levels
    const updatedLevels = [...levels];
    updatedLevels[currentLevelIndex].isCompleted = true;
    setLevels(updatedLevels);

    // Animation & Progression Sequence
    setTimeout(() => {
      // If correct, happy bunny. If wrong, neutral bunny (but still advanced)
      setBunnyEmotion(correct ? 'happy' : 'neutral');
      
      const nextIndex = currentLevelIndex + 1;
      
      if (nextIndex >= levels.length) {
        setGameState(GameState.WON);
      } else {
        setCurrentLevelIndex(nextIndex);
        // Auto scroll
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left: nextIndex * 140, // approximate stone width + gap
            behavior: 'smooth'
          });
        }

        // AUTO-ADVANCE: Automatically open the next question after landing
        setTimeout(() => {
            setShowModal(true);
        }, 800);
      }
    }, 600); // Wait for jump animation
  };

  const handleRestart = () => {
    setGameState(GameState.START);
    setLevels([]);
    setCurrentLevelIndex(0);
  };

  return (
    <div className="min-h-screen bg-sky-200 flex flex-col items-center justify-center font-sans overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 animate-bounce delay-700">
        <div className="w-16 h-16 bg-yellow-400 rounded-full opacity-80 blur-md"></div>
      </div>
      <div className="absolute bottom-20 left-10 animate-pulse delay-1000">
        <div className="w-20 h-20 bg-pink-300 rounded-full opacity-60 blur-lg"></div>
      </div>
      
      {/* Title Header */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3 bg-white/80 p-3 rounded-full shadow-lg backdrop-blur border-2 border-white">
        <div className="bg-orange-500 text-white p-2 rounded-full">
            <Music size={20} />
        </div>
        <div>
            <h1 className="text-orange-600 font-bold text-lg leading-none">拼音大冒險</h1>
            <p className="text-xs text-orange-400 font-semibold">Help Bunny Cross!</p>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative w-full max-w-5xl h-[500px] bg-gradient-to-b from-sky-300 to-blue-400 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl overflow-hidden border-0 md:border-8 border-white/30 flex flex-col">
        
        {/* River Animation Layer */}
        <div className="absolute bottom-0 w-full h-1/2 opacity-30 pointer-events-none">
           <div className="w-[200%] h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] animate-[wiggle_20s_linear_infinite]"></div>
        </div>

        {/* Start Screen */}
        {gameState === GameState.START && (
          <div className="absolute inset-0 z-40 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full animate-fade-in-up border-4 border-white">
              <div className="flex justify-center mb-6 scale-125">
                <Bunny emotion="happy" />
              </div>
              <h1 className="text-4xl font-black text-sky-600 mb-2 tracking-tight">準備好跳躍了嗎？</h1>
              <p className="text-gray-500 mb-8 font-medium">練習 8 個複韻母，幫助小兔子過河！</p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-8 opacity-90">
                {/* Visual indicator of what's coming, but not labeling stones explicitly in game */}
                {TARGET_RHYMES.map(r => (
                  <span key={r} className="bg-sky-100 text-sky-600 px-3 py-1 rounded-lg text-lg font-bold border border-sky-200">{r}</span>
                ))}
              </div>

              <button 
                onClick={startGame}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-2xl font-black py-4 rounded-2xl shadow-[0_6px_0_0_rgb(194,65,12)] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3"
              >
                {loading ? '準備中...' : <><Play fill="currentColor" /> 出發！</>}
              </button>
            </div>
          </div>
        )}

        {/* Win Screen */}
        {gameState === GameState.WON && (
          <div className="absolute inset-0 z-40 bg-yellow-400/90 flex flex-col items-center justify-center p-8 text-center">
             <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md animate-bounce border-4 border-yellow-200">
                <PartyPopper className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-4xl font-black text-gray-800 mb-4">挑戰成功！</h2>
                <p className="text-xl text-gray-600 mb-8">小兔子安全過河啦！</p>
                <button 
                  onClick={handleRestart}
                  className="bg-sky-500 hover:bg-sky-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105"
                >
                  <RotateCcw size={24} /> 再玩一次
                </button>
             </div>
          </div>
        )}

        {/* Gameplay Area (River & Stones) */}
        {gameState === GameState.PLAYING && (
           <div 
             ref={scrollContainerRef}
             className="w-full h-full overflow-x-auto overflow-y-hidden relative flex items-center px-20 md:px-32 no-scrollbar"
             style={{ scrollBehavior: 'smooth' }}
           >
              {/* Start Bank */}
              <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-emerald-500 border-r-8 border-emerald-600/30 z-10 flex items-center justify-center shadow-lg">
                 <div className="text-white font-black -rotate-90 whitespace-nowrap text-3xl opacity-80 tracking-widest">起點</div>
              </div>

              {/* The Stones Path */}
              <div className="flex items-center gap-16 md:gap-24 pl-12 pr-48 min-w-max h-full pt-20">
                 {levels.map((level, index) => {
                    const isActive = index === currentLevelIndex;
                    const isCompleted = level.isCompleted;
                    const isLocked = index > currentLevelIndex;

                    return (
                      <div key={level.id} className="relative flex flex-col items-center group">
                        
                        {/* Bunny Position */}
                        {isActive && !isLocked && (
                          <div className="absolute -top-20 z-30 transition-all duration-500 ease-in-out">
                            <Bunny emotion={bunnyEmotion} />
                            {/* "Click Me" hint - only show on first stone if not modal */}
                            {!showModal && index === 0 && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-xl shadow-lg text-sm font-bold text-sky-600 animate-bounce whitespace-nowrap border-2 border-sky-100">
                                    點擊石頭開始!
                                </div>
                            )}
                          </div>
                        )}

                        {/* Stone */}
                        <button
                          onClick={() => handleStoneClick(index)}
                          disabled={isLocked || isCompleted}
                          className={`
                            relative w-28 h-20 md:w-36 md:h-24 rounded-[45%] transition-all duration-300 transform
                            flex items-center justify-center border-b-[6px]
                            ${isCompleted 
                                ? 'bg-emerald-400 border-emerald-600' 
                                : isActive 
                                    ? 'bg-amber-100 border-amber-300 hover:bg-white hover:-translate-y-1 cursor-pointer scale-110 shadow-xl' 
                                    : 'bg-gray-400 border-gray-600 opacity-60 cursor-not-allowed'
                            }
                          `}
                        >
                           <span className={`text-3xl font-black ${isCompleted ? 'text-emerald-800' : 'text-amber-500/50'}`}>
                             {/* Stones now show numbers or checkmarks, not the rhyme text */}
                             {isCompleted ? <Check size={36} strokeWidth={4} /> : (index + 1)}
                           </span>
                           
                           {/* Water Ripples for active stone */}
                           {isActive && !isCompleted && (
                               <span className="absolute -inset-4 border-2 border-white/50 rounded-[45%] animate-ping opacity-75"></span>
                           )}
                        </button>
                        
                        {/* Connecting Line (Visual only) */}
                        {index < levels.length - 1 && (
                            <div className="absolute left-[80%] top-1/2 w-16 md:w-24 h-2 bg-white/20 -z-10 border-t-2 border-dashed border-white/40"></div>
                        )}
                      </div>
                    );
                 })}
                 
                 {/* Finish Bank */}
                 <div className="relative flex flex-col items-center justify-center ml-10">
                     <div className="w-40 h-80 bg-emerald-500 rounded-l-[3rem] border-l-8 border-emerald-600/30 flex items-center justify-center shadow-2xl">
                         <div className="text-white font-black text-3xl -rotate-90 tracking-widest">終點</div>
                     </div>
                     {/* Bunny lands here at the end */}
                     {gameState === GameState.WON && ( 
                        <div className="absolute top-1/2 -translate-y-full left-10">
                            <Bunny emotion="happy" />
                        </div>
                     )}
                 </div>
              </div>
           </div>
        )}

        {/* Modal Logic */}
        {showModal && levels[currentLevelIndex] && (
          <GameModal 
            question={levels[currentLevelIndex].question} 
            onAnswer={handleAnswer} 
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex items-center gap-2 text-sky-800 opacity-60 text-sm">
        <Info size={16} />
        <span>Powered by Gemini AI • 啟用語音功能</span>
      </div>
    </div>
  );
};

export default App;