
import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, Sparkles, Star, Heart, Trophy, Zap } from 'lucide-react';

interface GameModalProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
}

const GameModal: React.FC<GameModalProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = (option: string) => {
    if (hasSubmitted) return;
    
    setSelected(option);
    const correct = option === question.correctAnswer;
    setIsCorrect(correct);
    setHasSubmitted(true);

    setTimeout(() => {
      onAnswer(correct);
    }, 1500); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg">
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5) translateY(50px); opacity: 0; }
          70% { transform: scale(1.05) translateY(-10px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-pop-in { animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-float { animation: float 3s infinite ease-in-out; }
        
        .reward-ring {
          position: absolute;
          border-radius: 50%;
          border: 4px solid white;
          opacity: 0;
          animation: ping-custom 1s ease-out infinite;
        }
        @keyframes ping-custom {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      <div className="bg-white rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden transform transition-all animate-pop-in border-[12px] border-white relative">
        
        {/* Decorative Background Elements for Feedback */}
        {hasSubmitted && (
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-10 left-10"><Star size={60} fill="currentColor" /></div>
            <div className="absolute bottom-10 right-10"><Heart size={60} fill="currentColor" /></div>
            <div className="absolute top-1/2 right-10"><Zap size={60} fill="currentColor" /></div>
          </div>
        )}

        {/* Header Section */}
        <div className={`p-8 text-center relative transition-all duration-700 ${hasSubmitted ? (isCorrect ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-400 via-rose-500 to-pink-500') : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500'}`}>
          <div className="absolute inset-0 flex items-center justify-around opacity-20">
             {[...Array(8)].map((_, i) => <Star key={i} size={24} className="animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
          </div>
          <h2 className="text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-widest relative z-10">
             {hasSubmitted ? (isCorrect ? "💎 完美挑戰 💎" : "💡 再試一次 💡") : "🌟 拼音大探險"}
          </h2>
        </div>

        {/* Content Section */}
        <div className={`p-10 min-h-[480px] flex flex-col items-center justify-center transition-colors duration-500 ${hasSubmitted ? (isCorrect ? 'bg-green-50' : 'bg-red-50') : 'bg-sky-50'}`}>
          
          {!hasSubmitted ? (
            <div className="flex flex-col items-center gap-12 w-full">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-sky-200/50 rounded-[3rem] blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="bg-white px-16 py-10 rounded-[3rem] shadow-2xl border-4 border-sky-100 relative">
                    <div className="text-8xl font-black text-gray-800 text-center leading-relaxed tracking-wider">
                        {question.promptText}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-5 w-full">
                    {question.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCheck(option)}
                          className="p-6 rounded-[2rem] text-3xl font-black transition-all shadow-[0_8px_0_0_#e0f2fe] hover:shadow-[0_4px_0_0_#e0f2fe] hover:translate-y-1 active:shadow-none active:translate-y-2 bg-white text-sky-600 border-4 border-sky-50 hover:bg-sky-50 hover:border-sky-200"
                        >
                          {option}
                        </button>
                    ))}
                </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-10 w-full">
                <div className="relative">
                   {isCorrect ? (
                      <div className="relative animate-float">
                         <div className="reward-ring" style={{ width: '100%', height: '100%' }}></div>
                         <Trophy className="w-48 h-48 text-yellow-500 drop-shadow-2xl" strokeWidth={2.5} />
                         <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                           <CheckCircle size={32} />
                         </div>
                      </div>
                    ) : (
                      <div className="relative animate-shake">
                         <XCircle className="w-48 h-48 text-red-500 drop-shadow-xl" strokeWidth={2.5} />
                      </div>
                    )}
                </div>

                <div className="text-center space-y-2">
                    <h3 className={`text-7xl font-black tracking-tighter ${isCorrect ? 'text-green-600 drop-shadow-sm' : 'text-red-500'}`}>
                      {isCorrect ? "你太棒了！" : "喔喔！加油！"}
                    </h3>
                    {!isCorrect && (
                      <div className="bg-white/80 px-8 py-3 rounded-full border-2 border-red-100 shadow-sm inline-block">
                        <p className="text-2xl font-bold text-gray-500">正確答案是：<span className="text-red-500 font-black text-4xl">{question.correctAnswer}</span></p>
                      </div>
                    )}
                </div>

                <div className={`bg-white/90 backdrop-blur p-10 rounded-[4rem] shadow-2xl w-full text-center relative overflow-hidden border-4 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                    <div className={`absolute top-0 left-0 w-full h-3 ${isCorrect ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`}></div>
                    <p className="text-4xl font-black text-gray-700 leading-tight">
                        {question.explanation}
                    </p>
                    <div className="absolute -bottom-8 -right-8 text-sky-50 opacity-40"><Star size={120} fill="currentColor" /></div>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GameModal;
