
import React, { useState, useEffect, useRef } from 'react';
import { TARGET_RHYMES, GameState, GameMode, Question, Level, TongueTwister } from './types';
import { generateGameContent, generateTongueTwisters } from './services/geminiService';
import Bunny from './components/Bunny';
import GameModal from './components/GameModal';
import AudioPlayer from './components/AudioPlayer';
import { Play, RotateCcw, PartyPopper, Music, Info, Check, Utensils, Waves, BookOpen, ChevronLeft, Volume2, Sun, Cloud, Star, Heart, Sparkles, Zap, Trophy, Soup, CookingPot, UtensilsCrossed, Knife, Coffee, Drumstick } from 'lucide-react';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MENU);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [twisters, setTwisters] = useState<TongueTwister[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bunnyEmotion, setBunnyEmotion] = useState<'happy' | 'neutral' | 'jumping'>('neutral');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const startRiverGame = async () => {
    setLoading(true);
    // 20 levels as requested
    const questions = await generateGameContent(20, 'river');
    setLevels(questions.map((q, idx) => ({ id: idx, question: q, isCompleted: false })));
    setCurrentLevelIndex(0);
    setGameState(GameState.PLAYING);
    setGameMode(GameMode.RIVER);
    setLoading(false);
  };

  const startCookingGame = async () => {
    setLoading(true);
    // 20 levels as requested
    const questions = await generateGameContent(20, 'cooking');
    setLevels(questions.map((q, idx) => ({ id: idx, question: q, isCompleted: false })));
    setCurrentLevelIndex(0);
    setGameState(GameState.PLAYING);
    setGameMode(GameMode.COOKING);
    setLoading(false);
  };

  const startTwisters = async () => {
    setLoading(true);
    setGameMode(GameMode.TWISTERS);
    const data = await generateTongueTwisters();
    setTwisters(data);
    setLoading(false);
  };

  const handleAnswer = (correct: boolean) => {
    setShowModal(false);
    setBunnyEmotion('jumping');
    
    const updatedLevels = [...levels];
    updatedLevels[currentLevelIndex].isCompleted = true;
    setLevels(updatedLevels);

    setTimeout(() => {
      setBunnyEmotion(correct ? 'happy' : 'neutral');
      const nextIndex = currentLevelIndex + 1;
      if (nextIndex >= levels.length) {
        setGameState(GameState.WON);
      } else {
        setCurrentLevelIndex(nextIndex);
        if (gameMode === GameMode.RIVER && scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ left: nextIndex * 180, behavior: 'smooth' });
        }
        setTimeout(() => setShowModal(true), 1000);
      }
    }, 600);
  };

  const resetToMenu = () => {
    setShowModal(false);
    setGameMode(GameMode.MENU);
    setGameState(GameState.START);
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center gap-6 animate-fade-in-up relative py-10 px-4">
      <div className="absolute -top-10 -left-10 md:-left-20 text-yellow-400 animate-bounce"><Sun size={80} fill="currentColor" /></div>
      <div className="absolute top-20 -right-10 md:-right-20 text-sky-100 animate-pulse"><Cloud size={100} fill="currentColor" /></div>
      <div className="absolute bottom-10 -left-10 text-pink-100 rotate-12"><Heart size={60} fill="currentColor" /></div>

      <div className="flex justify-center mb-6 scale-[2.2] wiggle relative">
        <div className="absolute -inset-4 bg-white/40 rounded-full blur-xl animate-pulse"></div>
        <Bunny emotion="happy" />
      </div>
      
      <div className="text-center relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-50">
           <Sparkles className="text-yellow-400 animate-spin" />
           <Sparkles className="text-pink-400 animate-bounce" />
        </div>
        <h1 className="text-5xl md:text-[5.5rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-sky-400 via-sky-500 to-sky-700 drop-shadow-[0_8px_0_white] leading-tight">小兔拼音大樂園</h1>
        
        {/* Rhyme List Display on Cover */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {TARGET_RHYMES.map((r, i) => (
            <div key={r} className={`group px-6 py-3 rounded-2xl text-2xl md:text-3xl font-black shadow-xl border-b-[6px] transition-all hover:scale-110 cursor-default ${i % 2 === 0 ? 'bg-white text-sky-500 border-sky-200' : 'bg-sky-500 text-white border-sky-700'}`}>
              {r}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-6xl mt-12">
        <button onClick={startRiverGame} className="group relative bg-white p-10 rounded-[4rem] shadow-[0_24px_0_0_#bae6fd] hover:shadow-[0_12px_0_0_#bae6fd] hover:translate-y-3 transition-all border-4 border-sky-50 flex flex-col items-center gap-8 overflow-hidden">
          <div className="p-8 bg-sky-100 rounded-[2.5rem] text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-inner"><Waves size={56} /></div>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-700">小兔過河</h2>
            <p className="text-sky-500 font-black mt-3 text-lg">20 關動感挑戰</p>
          </div>
        </button>
        
        <button onClick={startCookingGame} className="group relative bg-white p-10 rounded-[4rem] shadow-[0_24px_0_0_#fed7aa] hover:shadow-[0_12px_0_0_#fed7aa] hover:translate-y-3 transition-all border-4 border-orange-50 flex flex-col items-center gap-8 overflow-hidden">
          <div className="p-8 bg-orange-100 rounded-[2.5rem] text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner"><Utensils size={56} /></div>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-700">美味廚房</h2>
            <p className="text-orange-500 font-black mt-3 text-lg">20 種廚房寶藏</p>
          </div>
        </button>

        <button onClick={startTwisters} className="group relative bg-white p-10 rounded-[4rem] shadow-[0_24px_0_0_#fbcfe8] hover:shadow-[0_12px_0_0_#fbcfe8] hover:translate-y-3 transition-all border-4 border-pink-50 flex flex-col items-center gap-8 overflow-hidden">
          <div className="p-8 bg-pink-100 rounded-[2.5rem] text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-inner"><BookOpen size={56} /></div>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-700">繞口令</h2>
            <p className="text-pink-500 font-black mt-3 text-lg">趣味挑戰挑戰</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderCookingGame = () => (
    <div className="relative w-full h-full flex flex-col items-center p-10 bg-[#fff7ed] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#f97316 2px, transparent 2px), linear-gradient(90deg, #f97316 2px, transparent 2px)', backgroundSize: '80px 80px' }}></div>
        
        {/* Wall Shelf with Tools */}
        <div className="absolute top-24 left-16 w-80 h-6 bg-orange-200 rounded-full flex justify-around items-end pb-8 text-4xl opacity-80 animate-float">🥄 🔪 🥢 🧂 🥣</div>
        <div className="absolute top-40 right-16 w-80 h-6 bg-orange-200 rounded-full flex justify-around items-end pb-8 text-4xl opacity-80 animate-float" style={{ animationDelay: '1.5s' }}>🥬 🥩 🥕 🥦 🥘</div>

        {/* Countertop with extra decorations (The Table) */}
        <div className="absolute bottom-0 w-full h-[45%] bg-[#d97706] border-t-8 border-[#b45309] shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)]">
           {/* Detailed Kitchen Items on the Table as requested */}
           <div className="absolute -top-16 left-[15%] flex gap-10 opacity-95 scale-125">
              <span className="text-6xl drop-shadow-md">🍲</span>
              <span className="text-6xl drop-shadow-md">🧂</span>
              <span className="text-6xl drop-shadow-md">🥢</span>
           </div>
           <div className="absolute -top-16 right-[15%] flex gap-10 opacity-95 scale-125">
              <span className="text-6xl drop-shadow-md">🍳</span>
              <span className="text-6xl drop-shadow-md">🍽️</span>
              <span className="text-6xl drop-shadow-md">🔪</span>
           </div>
           {/* Wooden Texture Detail */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(0,0,0,0.5) 101px)' }}></div>
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        {/* Progress Grid */}
        <div className="grid grid-cols-10 gap-2 md:gap-3 mb-8 bg-white/70 p-4 md:p-6 rounded-[3rem] backdrop-blur-xl shadow-2xl border-4 border-orange-100">
          {levels.map((lvl, idx) => (
            <div key={idx} className={`w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl border-2 transition-all ${lvl.isCompleted ? 'bg-gradient-to-br from-orange-400 to-orange-600 border-white text-white shadow-xl scale-110' : 'bg-white/50 border-gray-100 opacity-40'}`}>
              {lvl.isCompleted ? lvl.question.itemImage : <Star className="text-orange-200" size={14} />}
            </div>
          ))}
        </div>
        
        <div className="bg-white p-12 md:p-16 rounded-[4rem] md:rounded-[5rem] shadow-2xl flex flex-col items-center gap-10 border-t-[16px] border-orange-400 relative">
          <div className="absolute -top-12 bg-orange-500 text-white px-8 md:px-12 py-3 rounded-full font-black text-xl md:text-2xl shadow-xl flex items-center gap-3">
            <UtensilsCrossed size={24} /> 廚房尋寶：20 道關卡
          </div>
          <Bunny emotion={bunnyEmotion} />
          <div className="text-center w-64 md:w-[32rem]">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">食材做大餐</h2>
            <div className="w-full bg-gray-100 h-8 rounded-full mt-8 overflow-hidden border-4 border-orange-50 p-1 shadow-inner">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${(levels.filter(l => l.isCompleted).length / levels.length) * 100}%` }}></div>
            </div>
            <p className="text-orange-600 font-black mt-4 text-xl">已集齊: {levels.filter(l => l.isCompleted).length} / {levels.length}</p>
          </div>
          
          {gameState !== GameState.WON && !showModal && (
            <button onClick={() => setShowModal(true)} className="group bg-orange-500 text-white px-16 md:px-20 py-5 md:py-6 rounded-[3rem] font-black text-3xl md:text-4xl shadow-[0_12px_0_0_#9a3412] hover:shadow-[0_6px_0_0_#9a3412] hover:translate-y-1.5 active:translate-y-3 active:shadow-none transition-all flex items-center gap-6">
              <Sparkles size={40} className="group-hover:rotate-12 transition-transform" /> 下一個！
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Added renderTwisters to display the tongue twister challenge screen
  const renderTwisters = () => (
    <div className="w-full h-full flex flex-col items-center p-6 md:p-12 overflow-y-auto no-scrollbar bg-[#fff5f7]">
      <div className="max-w-6xl w-full flex flex-col items-center gap-12">
        <div className="text-center relative">
          <div className="absolute -top-6 -left-12 text-pink-200 animate-pulse"><Music size={60} /></div>
          <h2 className="text-5xl md:text-[5.5rem] font-black text-pink-500 drop-shadow-sm tracking-tight">韻母繞口令</h2>
          <p className="text-pink-400 font-black text-xl md:text-2xl mt-4">練習發音，挑戰你的小舌頭！</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full pb-20">
          {twisters.map((t) => (
            <div key={t.id} className="bg-white rounded-[3.5rem] p-8 md:p-10 shadow-2xl border-4 border-pink-50 flex flex-col gap-8 relative overflow-hidden group hover:scale-[1.02] transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-[5rem] flex items-center justify-center">
                 <span className="text-5xl font-black text-pink-500/20">{t.focusRhyme}</span>
              </div>
              
              <div className="flex-1 space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 font-black text-xl">
                    {t.id}
                  </div>
                  <div className="px-5 py-2 bg-pink-50 text-pink-600 rounded-full font-black text-sm uppercase tracking-widest border border-pink-100">
                    重點韻母: {t.focusRhyme}
                  </div>
                </div>

                <p className="text-4xl md:text-[2.75rem] font-black text-gray-800 leading-tight">
                  {t.text}
                </p>
                
                <div className="p-6 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-bold text-xl italic leading-relaxed">{t.translation}</p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t-2 border-pink-50/50">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 font-black text-sm uppercase tracking-widest">播放範例</span>
                  <AudioPlayer text={t.text} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center justify-center font-sans overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 text-sky-200/40 -rotate-12"><Star size={120} fill="currentColor" /></div>
      <div className="absolute bottom-1/4 right-1/4 text-sky-200/40 rotate-45"><Star size={140} fill="currentColor" /></div>

      {gameMode !== GameMode.MENU && (
        <button 
          onClick={resetToMenu} 
          className="absolute top-6 left-6 md:top-10 md:left-10 z-[100] bg-white/95 px-6 py-4 md:px-8 md:py-5 rounded-[2.5rem] shadow-xl hover:bg-sky-50 transition-all flex items-center gap-4 font-black text-xl md:text-2xl text-gray-700 border-4 border-white active:scale-90 group"
        >
          <ChevronLeft size={36} className="group-hover:-translate-x-2 transition-transform" strokeWidth={3} /> 返回
        </button>
      )}

      {loading ? (
        <div className="flex flex-col items-center gap-10 animate-in zoom-in duration-500">
          <div className="relative">
            <div className="w-40 h-40 border-[16px] border-sky-100 border-t-sky-500 rounded-full animate-spin shadow-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center text-6xl">🐰</div>
          </div>
          <p className="text-sky-600 font-black text-3xl md:text-[2.5rem] tracking-[0.3em] animate-pulse">小兔拼命準備中...</p>
        </div>
      ) : (
        <div className="w-full max-w-[98vw] h-[95vh] relative z-10 flex items-center justify-center">
          {gameMode === GameMode.MENU && renderMenu()}
          
          {(gameMode === GameMode.RIVER || gameMode === GameMode.COOKING || gameMode === GameMode.TWISTERS) && (
            <div className="w-full h-full bg-white/50 backdrop-blur-2xl rounded-[4rem] md:rounded-[5rem] border-[12px] md:border-[16px] border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden">
               
               {gameMode === GameMode.RIVER && (
                 <div className="w-full h-full relative overflow-hidden bg-sky-50">
                    {/* Scene Background Decor */}
                    <div className="absolute top-0 w-full h-40 bg-emerald-100/60 flex items-end justify-around px-32 pb-6 opacity-90 z-10">
                      <span className="text-5xl animate-bounce" style={{ animationDelay: '0s' }}>🌲</span>
                      <span className="text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌸</span>
                      <span className="text-5xl animate-bounce" style={{ animationDelay: '1s' }}>🌳</span>
                      <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌺</span>
                      <span className="text-5xl animate-bounce" style={{ animationDelay: '0.7s' }}>🌿</span>
                    </div>
                    <div className="absolute bottom-0 w-full h-40 bg-emerald-100/60 flex items-start justify-around px-32 pt-6 opacity-90 z-10">
                      <span className="text-5xl">🌷</span><span className="text-5xl">🌲</span><span className="text-5xl">🌻</span><span className="text-5xl">🌳</span><span className="text-5xl">🍀</span>
                    </div>

                    {/* FLOWING RIVER WITH WAVES as requested */}
                    <div className="absolute top-40 bottom-40 left-0 right-0 overflow-hidden z-0">
                      <div className="absolute inset-0 bg-sky-400 overflow-hidden">
                        {/* Layer 1: Base Waves */}
                        <div className="absolute inset-0 river-flow">
                           <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                             <defs>
                               <pattern id="wavePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                 <path d="M0 50 Q 25 30 50 50 T 100 50 V 100 H 0 Z" fill="#38bdf8" opacity="0.7" />
                               </pattern>
                             </defs>
                             <rect width="200%" height="100%" fill="url(#wavePattern)" />
                           </svg>
                        </div>
                        {/* Layer 2: Fast Light Highlights */}
                        <div className="absolute inset-0 river-flow-slow opacity-50">
                           <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                             <defs>
                               <pattern id="wavePattern2" x="0" y="0" width="150" height="100" patternUnits="userSpaceOnUse">
                                 <path d="M0 60 Q 37.5 40 75 60 T 150 60 V 100 H 0 Z" fill="#7dd3fc" />
                               </pattern>
                             </defs>
                             <rect width="200%" height="100%" fill="url(#wavePattern2)" />
                           </svg>
                        </div>
                        {/* Layer 3: Foam bubbles */}
                        <div className="absolute inset-0">
                           {[...Array(20)].map((_, i) => (
                             <div key={i} className="absolute bg-white/30 rounded-full animate-pulse" style={{ width: Math.random()*20+5, height: Math.random()*20+5, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDuration: `${3+Math.random()*4}s` }}></div>
                           ))}
                        </div>
                      </div>
                    </div>

                    {/* River Crossing Items */}
                    <div ref={scrollContainerRef} className="w-full h-full overflow-x-auto overflow-y-hidden relative flex items-center px-64 no-scrollbar z-20" style={{ scrollBehavior: 'smooth' }}>
                       <div className="flex items-center gap-48 pl-20 pr-80 min-w-max h-full pt-28 relative">
                          {levels.map((level, index) => (
                            <div key={index} className="relative flex flex-col items-center">
                              {index === currentLevelIndex && !level.isCompleted && (
                                <div className="absolute -top-36 z-30 transition-all flex flex-col items-center group">
                                  <div className="mb-2 scale-125"><Bunny emotion={bunnyEmotion} /></div>
                                  {!showModal && (
                                    <div className="bg-white px-10 py-4 rounded-[2.5rem] shadow-2xl text-2xl font-black text-sky-600 animate-bounce mt-4 border-4 border-sky-50 flex items-center gap-4">
                                      <Zap size={28} fill="currentColor" className="text-yellow-400" /> 點我跳!
                                    </div>
                                  )}
                                </div>
                              )}
                              <button 
                                onClick={() => index === currentLevelIndex && setShowModal(true)} 
                                disabled={index > currentLevelIndex} 
                                className={`w-56 h-36 rounded-[65%] border-b-[16px] transition-all flex items-center justify-center shadow-2xl relative group ${level.isCompleted ? 'bg-gradient-to-br from-emerald-400 to-green-600 border-emerald-800' : index === currentLevelIndex ? 'bg-white border-amber-400 scale-125' : 'bg-gray-200 border-gray-400 opacity-20'}`}
                              >
                                <div className="absolute inset-0 rounded-[65%] stone-shine"></div>
                                {level.isCompleted ? (
                                  <Check size={64} className="text-white drop-shadow-lg" strokeWidth={5} />
                                ) : (
                                  <span className={`text-6xl font-black ${index === currentLevelIndex ? 'text-amber-500' : 'text-gray-400'}`}>{index + 1}</span>
                                )}
                              </button>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}
               
               {gameMode === GameMode.COOKING && renderCookingGame()}
               {gameMode === GameMode.TWISTERS && renderTwisters()}
               
               {gameState === GameState.WON && (
                 <div className="absolute inset-0 z-[110] bg-sky-600/90 backdrop-blur-[40px] flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-700">
                    <div className="bg-white p-12 md:p-24 rounded-[4rem] md:rounded-[6rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] max-w-4xl border-[16px] border-white flex flex-col items-center gap-10 md:gap-12 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-400 via-pink-400 to-sky-400"></div>
                       <div className="text-8xl md:text-[12rem] animate-bounce">🥇</div>
                       <div>
                         <h2 className="text-5xl md:text-8xl font-black text-gray-800 tracking-tighter">大冒險成功！</h2>
                         <p className="text-2xl md:text-4xl text-sky-500 mt-6 md:mt-10 font-black italic tracking-wide">完成 20 關挑戰，小兔以此為榮！</p>
                       </div>
                       <div className="flex gap-8 mt-6">
                         <button onClick={resetToMenu} className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-700 text-white text-2xl md:text-[3rem] font-black px-12 py-6 md:px-32 md:py-12 rounded-[4rem] shadow-xl hover:translate-y-2 active:translate-y-4 transition-all flex items-center gap-8 border-4 border-white/20">
                           <RotateCcw size={64} className="hidden md:block" strokeWidth={5} /> 再玩一次！
                         </button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      )}

      {showModal && levels[currentLevelIndex] && (
        <GameModal question={levels[currentLevelIndex].question} onAnswer={handleAnswer} />
      )}

      <div className="mt-8 flex items-center gap-6 text-sky-800/30 text-xl font-black tracking-[0.4em] uppercase">
        <Star size={28} /> 魔法小兔拼音大樂園 • 20 關版 <Star size={28} />
      </div>
    </div>
  );
};

export default App;
