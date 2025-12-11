import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

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

    // Proceed to next level even if wrong, after delay
    // Increased delay to 3.5s to allow reading the big explanation
    setTimeout(() => {
      onAnswer(correct);
    }, 3500); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <style>{`
        @keyframes firework {
          0% { transform: translate(var(--x), var(--initialY)); width: var(--initialSize); opacity: 1; }
          50% { width: 0.5rem; opacity: 1; }
          100% { width: var(--finalSize); opacity: 0; }
        }
        .firework, .firework::before, .firework::after {
          --initialSize: 0.5vmin;
          --finalSize: 45vmin;
          --particleSize: 0.2vmin;
          --color1: yellow;
          --color2: khaki;
          --color3: white;
          --color4: lime;
          --color5: gold;
          --color6: mediumseagreen;
          --y: -30vmin;
          --x: -50%;
          --initialY: 60vmin;
          content: "";
          animation: firework 2s infinite;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, var(--y));
          width: var(--initialSize);
          aspect-ratio: 1;
          background: 
            radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 50% 0%,
            radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 50%,
            radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 50% 100%,
            radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 0% 50%,
            
            /* bottom right */
            radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 80% 90%,
            radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 95% 90%,
            radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 90% 85%,
            radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 85% 80%,
            radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 80% 85%,
            radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 75% 90%,
            radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 90% 95%,
            
            /* top left */
            radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 20% 10%,
            radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 5% 10%,
            radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 10% 15%,
            radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 15% 20%,
            radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 20% 15%,
            radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 25% 10%,
            radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 10% 5%;
          background-size: var(--initialSize) var(--initialSize);
          background-repeat: no-repeat;
        }
        .firework::before {
          --x: -50%;
          --y: -50%;
          --initialY: -50%;
          transform: translate(-50%, -50%) rotate(40deg) scale(1.3) rotateY(40deg);
        }
        .firework::after {
          --x: -50%;
          --y: -50%;
          --initialY: -50%;
          transform: translate(-50%, -50%) rotate(170deg) scale(1.15) rotateY(-30deg);
        }
        .firework:nth-child(2) {
          --x: 30vmin;
          --initialY: -20vmin;
        }
        .firework:nth-child(2)::before {
          --x: -50%;
          --y: -50%;
          --initialY: -50%;
          transform: translate(-50%, -50%) rotate(10deg) scale(1.2) rotateY(20deg);
        }
        .firework:nth-child(2)::after {
          --x: -50%;
          --y: -50%;
          --initialY: -50%;
          transform: translate(-50%, -50%) rotate(150deg) scale(1.1) rotateY(10deg);
        }
      `}</style>
      
      {/* Fireworks Effect - Only if correct */}
      {hasSubmitted && isCorrect && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework" style={{left: '20%', top: '30%'}}></div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 z-40">
        
        {/* Header - Always visible but changes style */}
        <div className={`p-4 text-center relative transition-colors duration-500 ${hasSubmitted ? (isCorrect ? 'bg-green-500' : 'bg-red-400') : 'bg-amber-300'}`}>
          <h2 className={`text-2xl font-black tracking-wide ${hasSubmitted ? 'text-white' : 'text-amber-900'}`}>
             {hasSubmitted ? (isCorrect ? "🎉 答對了！" : "💪 加油！") : "⭐ 挑戰時間"}
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="p-8 min-h-[400px] flex flex-col items-center justify-center">
          
          {!hasSubmitted ? (
            /* QUESTION VIEW */
            <div className="flex flex-col items-center gap-8 w-full animate-in fade-in zoom-in-95 duration-300">
                <div className="text-6xl font-black text-gray-800 text-center leading-relaxed tracking-wider py-4">
                    {question.promptText}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-4 gap-4 w-full">
                    {question.options.map((option, idx) => {
                    let btnClass = "bg-sky-50 hover:bg-sky-100 text-sky-800 border-2 border-sky-100 shadow-[0_4px_0_0_rgba(186,230,253,1)] hover:shadow-[0_2px_0_0_rgba(186,230,253,1)] hover:translate-y-[2px]";
                    
                    if (selected === option) {
                        btnClass = "bg-sky-200 border-sky-400 text-sky-900";
                    }

                    return (
                        <button
                        key={idx}
                        onClick={() => handleCheck(option)}
                        className={`p-4 rounded-xl text-3xl font-bold transition-all duration-100 active:shadow-none active:translate-y-[4px] ${btnClass}`}
                        >
                        {option}
                        </button>
                    );
                    })}
                </div>
            </div>
          ) : (
            /* FEEDBACK VIEW - CENTERED & BIG */
            <div className="flex flex-col items-center justify-center gap-6 w-full animate-in zoom-in-75 duration-500">
                {isCorrect ? (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="w-32 h-32 text-green-500 animate-bounce" strokeWidth={2.5} />
                        <h3 className="text-5xl font-black text-green-600 tracking-widest mt-2">太棒了！</h3>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                         <XCircle className="w-32 h-32 text-red-500" strokeWidth={2.5} />
                         <div className="text-center">
                            <h3 className="text-5xl font-black text-red-500 mb-2">哎呀！</h3>
                            <p className="text-2xl font-bold text-gray-400">正確答案是...</p>
                         </div>
                    </div>
                )}

                {/* Big Explanation Box */}
                <div className="bg-yellow-50 border-4 border-yellow-400 p-8 rounded-3xl shadow-xl mt-4 w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-yellow-200"></div>
                    <p className="text-4xl font-black text-gray-800 leading-normal">
                        {question.explanation}
                    </p>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GameModal;