import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Bot, 
  ArrowRight, 
  Target,
  Sparkles,
  RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// We keep this as a safe fallback just in case your API hasn't loaded yet
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

// Add the { data } prop here
export default function QuizModule({ data }) {
  // Use the real data if it exists, otherwise use the Mock data
  const quizSource = data && data.length > 0 ? data : MOCK_QUIZ_DATA;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // AI Streaming State
  const [aiFeedback, setAiFeedback] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Read from quizSource
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

    // Trigger AI Feedback Stream
    setIsGenerating(true);
    setAiFeedback('');
  };

  // Simulate AI Token Streaming for the explanation
  useEffect(() => {
    if (!isGenerating || !isSubmitted) return;

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
    }, 30); // Fast typing speed

    return () => clearInterval(interval);
  }, [isGenerating, isSubmitted, currentQuestion]);

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
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[550px] py-8">
      
      {!isComplete ? (
        <div className="w-full flex flex-col w-full">
          {/* Header & Progress */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-zinc-400">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="font-medium tracking-tight">Knowledge Check</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-500">
                Question {currentIndex + 1} of {quizSource.length}
              </span>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: `${(currentIndex / quizSource.length) * 100}%` }}
                  animate={{ width: `${((currentIndex + 1) / quizSource.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Question Text */}
              <h2 className="text-2xl md:text-3xl font-semibold text-zinc-100 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Options List */}
              <div className="flex flex-col gap-3 mt-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrectAnswer = option.id === currentQuestion.correctAnswer;
                  
                  // Determine styling based on state
                  let cardStyle = "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]";
                  let icon = null;

                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      cardStyle = "border-emerald-500/50 bg-emerald-500/10 text-emerald-50";
                      icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
                    } else if (isSelected && !isCorrectAnswer) {
                      cardStyle = "border-red-500/50 bg-red-500/10 text-red-50";
                      icon = <XCircle className="w-5 h-5 text-red-400" />;
                    } else {
                      cardStyle = "border-white/5 bg-transparent text-zinc-600 opacity-50";
                    }
                  } else if (isSelected) {
                    cardStyle = "border-blue-500 bg-blue-500/10 text-blue-50";
                  }

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={isSubmitted}
                      whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                      whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                      className={`relative flex items-center justify-between w-full p-5 rounded-2xl border transition-all text-left ${cardStyle} disabled:cursor-default`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                          isSelected && !isSubmitted ? 'bg-blue-500 text-white' : 'bg-white/10'
                        }`}>
                          {option.id}
                        </div>
                        <span className="text-base md:text-lg">{option.text}</span>
                      </div>
                      {icon && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          {icon}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Action Area & AI Feedback */}
              <div className="mt-4">
                {!isSubmitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedOption}
                    className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-xl transition-all disabled:opacity-50"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex flex-col gap-6 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                    
                    <div className="relative z-10 flex gap-4">
                      <Bot className={`w-6 h-6 text-purple-400 mt-1 ${isGenerating ? 'animate-pulse' : ''}`} />
                      <div className="flex-1 space-y-2">
                        <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2">
                          AI Analysis
                          {isGenerating && (
                            <span className="flex gap-1">
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
                              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
                            </span>
                          )}
                        </h4>
                        <p className="text-zinc-200 leading-relaxed text-base">
                          {aiFeedback}
                          {isGenerating && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="inline-block w-2 h-4 ml-1 bg-purple-400 rounded-sm translate-y-0.5"
                            />
                          )}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={isGenerating}
                      className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] font-semibold rounded-xl transition-all mt-2"
                    >
                      {currentIndex === quizSource.length - 1 ? 'View Results' : 'Next Question'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        // Results Screen
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl"
        >
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
              <motion.circle
                cx="64" cy="64" r="60"
                stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * (score / quizSource.length))}
                className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                initial={{ strokeDashoffset: 377 }}
                animate={{ strokeDashoffset: 377 - (377 * (score / quizSource.length)) }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{score}/{quizSource.length}</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed</h2>
          <p className="text-zinc-400 mb-8 max-w-sm">
            {score === quizSource.length 
              ? "Flawless execution. Your contextual understanding is perfect." 
              : "Good effort. Review the AI feedback to patch the gaps in your mental model."}
          </p>

          <div className="flex gap-4">
            <Button variant="outline" onClick={resetQuiz} className="border-white/10 hover:bg-white/5 h-11 px-6">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold h-11 px-6">
              Return to Hub
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}