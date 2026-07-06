import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Bot, 
  ArrowRight, 
  Target,
  Sparkles,
  RefreshCcw,
  Keyboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_QUIZ_DATA = [
  {
    id: 1,
    question: "What is the primary architectural benefit of an 'Optimistic UI'?",
    options: [
      { id: 'A', text: "It reduces the actual server processing time by caching data." },
      { id: 'B', text: "It updates the frontend instantly assuming success, hiding network latency." },
      { id: 'C', text: "It guarantees zero errors when making database mutations." },
      { id: 'D', text: "It automatically generates positive AI feedback for users." }
    ],
    correctAnswer: 'B',
    explanation: "Optimistic UI doesn't speed up the backend—it tricks the human brain. By instantly updating the DOM before the server responds, it creates a perceived latency of zero, making the application feel lightning fast."
  },
  {
    id: 2,
    question: "Why are Vector Databases essential for modern Large Language Models (LLMs)?",
    options: [
      { id: 'A', text: "They store data as multidimensional arrays to map semantic relationships." },
      { id: 'B', text: "They are the only databases that can handle JSON objects natively." },
      { id: 'C', text: "They automatically train new LLMs in the background." },
      { id: 'D', text: "They compress raw video files into textual summaries." }
    ],
    correctAnswer: 'A',
    explanation: "Standard databases match exact keywords. Vector databases convert concepts into numbers (embeddings) and plot them in space. This allows the AI to find information based on meaning, not just exact word matches."
  }
];

export default function QuizModule({ data }) {
  const quizSource = data && data.length > 0 ? data : MOCK_QUIZ_DATA;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const [aiFeedback, setAiFeedback] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQuestion = quizSource[currentIndex];
  const isComplete = currentIndex >= quizSource.length;

  const handleSelect = (optionId) => {
    if (isSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setIsGenerating(true);
    setAiFeedback('');
  };

  // Simulate AI streaming for question analysis response blocks
  useEffect(() => {
    if (!isGenerating || !isSubmitted || !currentQuestion) return;

    const words = currentQuestion.explanation.split(' ');
    let wordIndex = 0;
    
    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        setAiFeedback((prev) => prev + (prev ? ' ' : '') + words[wordIndex]);
        wordIndex++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isGenerating, isSubmitted, currentIndex]);

  // Accessibility Hotkeys handler loop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isComplete) return;

      const keyMap = {
        KeyA: 'A', Digit1: 'A',
        KeyB: 'B', Digit2: 'B',
        KeyC: 'C', Digit3: 'C',
        KeyD: 'D', Digit4: 'D'
      };

      if (keyMap[e.code] && !isSubmitted) {
        e.preventDefault();
        handleSelect(keyMap[e.code]);
      } else if (e.code === 'Enter') {
        e.preventDefault();
        if (!isSubmitted && selectedOption) {
          handleSubmit();
        } else if (isSubmitted && !isGenerating) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, isSubmitted, isGenerating, currentIndex, isComplete]);

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAiFeedback('');
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAiFeedback('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[550px] py-4 select-none px-2">
      
      {!isComplete ? (
        <div className="w-full flex flex-col">
          {/* HEADER LAYER PROGRESS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-zinc-200 dark:border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm block">Knowledge Check</span>
                <span className="text-[11px] text-zinc-500 font-medium">Concept Validation Core</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-zinc-300/30 dark:border-white/5 whitespace-nowrap">
                Question {currentIndex + 1} of {quizSource.length}
              </span>
              <div className="w-32 h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: `${(currentIndex / quizSource.length) * 100}%` }}
                  animate={{ width: `${((currentIndex + 1) / quizSource.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* QUESTION PANEL */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* OPTIONS MATRIX */}
              <div className="flex flex-col gap-3 mt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrectAnswer = option.id === currentQuestion.correctAnswer;
                  
                  let cardStyle = "border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.01] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04] hover:border-zinc-300 dark:hover:border-white/20";
                  let indicatorBadge = "bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-300";
                  let icon = null;

                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      cardStyle = "border-emerald-500/40 dark:border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-50";
                      indicatorBadge = "bg-emerald-500 text-white";
                      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
                    } else if (isSelected && !isCorrectAnswer) {
                      cardStyle = "border-red-500/40 dark:border-red-500/50 bg-red-500/5 dark:bg-red-500/10 text-red-900 dark:text-red-50";
                      indicatorBadge = "bg-red-500 text-white";
                      icon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
                    } else {
                      cardStyle = "border-zinc-100 dark:border-white/[0.02] bg-transparent text-zinc-400 dark:text-zinc-600 opacity-40";
                      indicatorBadge = "bg-zinc-100/50 dark:bg-white/5 text-zinc-400 dark:text-zinc-600";
                    }
                  } else if (isSelected) {
                    cardStyle = "border-blue-500 dark:border-blue-400 bg-blue-500/[0.03] dark:bg-blue-400/10 text-blue-700 dark:text-blue-400 font-medium shadow-sm";
                    indicatorBadge = "bg-blue-500 dark:bg-blue-400 text-white dark:text-zinc-950";
                  }

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={isSubmitted}
                      whileHover={!isSubmitted ? { scale: 1.005 } : {}}
                      whileTap={!isSubmitted ? { scale: 0.995 } : {}}
                      className={`relative flex items-center justify-between w-full p-4.5 rounded-2xl border transition-all text-left shadow-xs ${cardStyle} disabled:cursor-default`}
                    >
                      <div className="flex items-center gap-4 pr-4">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-colors ${indicatorBadge}`}>
                          {option.id}
                        </div>
                        <span className="text-sm sm:text-base leading-relaxed">{option.text}</span>
                      </div>
                      {icon && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0">
                          {icon}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* DYNAMIC ACTION MATRIX ELEMENT */}
              <div className="mt-4">
                {!isSubmitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedOption}
                    className="w-full h-12 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold rounded-xl transition-all disabled:opacity-40"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex flex-col gap-6 p-5 sm:p-6 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                    
                    <div className="relative z-10 flex gap-4">
                      <Bot className={`w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0 ${isGenerating ? 'animate-pulse' : ''}`} />
                      <div className="flex-1 space-y-2 min-w-0">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-2">
                          AI Analysis
                          {isGenerating && (
                            <span className="flex gap-0.5">
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}>.</motion.span>
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}>.</motion.span>
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}>.</motion.span>
                            </span>
                          )}
                        </h4>
                        <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed text-sm sm:text-base">
                          {aiFeedback}
                          {isGenerating && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              className="inline-block w-1.5 h-3.5 ml-1 bg-purple-500 dark:bg-purple-400 rounded-sm translate-y-0.5"
                            />
                          )}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={isGenerating}
                      className="w-full h-12 bg-purple-600 dark:bg-purple-600 hover:bg-purple-500 dark:hover:bg-purple-500 text-white shadow-md shadow-purple-500/10 font-semibold rounded-xl transition-all mt-2"
                    >
                      <span>{currentIndex === quizSource.length - 1 ? 'View Results' : 'Next Question'}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        // RESULTS DISPLAY PANEL
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center justify-center text-center p-6 sm:p-10 rounded-3xl border shadow-md bg-white dark:bg-[#0a0a0c] border-zinc-200 dark:border-white/10"
        >
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-100 dark:text-white/5" />
              <motion.circle
                cx="64" cy="64" r="58"
                stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * (score / quizSource.length))}
                className="text-blue-500 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                initial={{ strokeDashoffset: 364 }}
                animate={{ strokeDashoffset: 364 - (364 * (score / quizSource.length)) }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{score}/{quizSource.length}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-2">Quiz Evaluation Complete</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-sm sm:text-base leading-relaxed">
            {score === quizSource.length 
              ? "Flawless execution. Your contextual understanding is perfect." 
              : "Good effort. Review the AI feedback breakdowns to patch the gaps in your dynamic mental memory layout maps."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
            <Button variant="outline" onClick={resetQuiz} className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold text-sm h-11">
              <RefreshCcw className="w-3.5 h-3.5 mr-2" />
              <span>Retake</span>
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold rounded-xl text-sm h-11 shadow-sm">
              Return to Hub
            </Button>
          </div>
        </motion.div>
      )}

      {/* FOOTER KEYBOARD INSTRUCTIONS SHORTCUT HOVER */}
      {!isComplete && (
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 px-4 py-2 rounded-xl mt-8">
          <span className="flex items-center gap-1"><Keyboard className="w-3.5 h-3.5" /> Shortcuts:</span>
          <span><kbd className="bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold">1-4</kbd> / <kbd className="bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold">A-D</kbd> Toggle Options</span>
          <span><kbd className="bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold">Enter</kbd> Confirm / Advance</span>
        </div>
      )}
    </div>
  );
}