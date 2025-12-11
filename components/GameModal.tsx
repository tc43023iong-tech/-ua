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
    setTimeout(() => {
      onAnswer(correct);
    }, 2500); 
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
        
        {/* Header */}
        <div className={`p-4 text-center relative transition-colors ${hasSubmitted ? (isCorrect ? 'bg-green-400' : 'bg-orange-300') : 'bg-amber-300'}`}>
          <h2 className={`text-2xl font-black tracking-wide ${hasSubmitted ? 'text-white' : 'text-amber-900'}`}>
             {hasSubmitted ? (isCorrect ? "🎉 答對了！" : "💪 加油！") : "⭐ 挑戰時間"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center gap-6">
          
          <div className="text-5xl font-black text-gray-800 text-center py-6 leading-relaxed tracking-wider">
            {question.promptText}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-4 gap-3 w-full">
            {question.options.map((option, idx) => {
              let btnClass = "bg-sky-50 hover:bg-sky-100 text-sky-800 border-2 border-sky-100 shadow-[0_4px_0_0_rgba(186,230,253,1)] hover:shadow-[0_2px_0_0_rgba(186,230,253,1)] hover:translate-y-[2px]";
              
              if (hasSubmitted) {
                if (option === question.correctAnswer) {
                  // Correct answer always Green
                  btnClass = "bg-green-100 border-green-500 text-green-700 shadow-none translate-y-[4px]";
                } else if (option === selected && option !== question.correctAnswer) {
                  // Wrong selected answer Red
                  btnClass = "bg-red-100 border-red-400 text-red-700 shadow-none translate-y-[4px]";
                } else {
                  btnClass = "opacity-50 bg-gray-50 border-gray-100 shadow-none";
                }
              } else if (selected === option) {
                btnClass = "bg-sky-200 border-sky-400 text-sky-900";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleCheck(option)}
                  disabled={hasSubmitted}
                  className={`p-3 rounded-xl text-xl md:text-2xl font-bold transition-all duration-100 active:shadow-none active:translate-y-[4px] ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {hasSubmitted && (
            <div className={`mt-4 w-full p-3 rounded-xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
              <div className="flex items-center gap-2 text-xl font-black mb-1">
                {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                <span>{isCorrect ? "太棒了！" : "哎呀！正確答案是..."}</span>
              </div>
              {question.explanation && <p className="text-sm opacity-90">{question.explanation}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;