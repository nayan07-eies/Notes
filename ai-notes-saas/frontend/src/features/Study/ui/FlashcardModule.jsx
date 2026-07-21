import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCw, 
  X, 
  Check, 
  BrainCircuit,
  Trophy,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Keyboard
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const MOCK_FLASHCARDS = [
  { id: 1, term: 'Latent Space', definition: 'A compressed, multi-dimensional representation of data where similar items are mapped closer together, foundational for AI models.' },
  { id: 2, term: 'Optimistic UI', definition: 'A frontend pattern that updates the interface instantly assuming a successful backend response, hiding network latency from the user.' },
  { id: 3, term: 'Spaced Repetition', definition: 'A learning technique that incorporates increasing intervals of time between subsequent reviews of previously learned material.' },
  { id: 4, term: 'Vector Embeddings', definition: 'Numerical arrays representing the semantic meaning of text, allowing search engines to find concepts rather than just matching keywords.' }
];

export default function FlashcardModule() {
  const [cards, setCards] = useState(MOCK_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [results, setResults] = useState({ mastered: 0, review: 0 });
  const [incorrectCardIds, setIncorrectCardIds] = useState([]);

  const currentCard = cards[currentIndex];
  const isComplete = currentIndex >= cards.length;

  const handleFlip = () => {
    if (isComplete) return;
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = (status) => {
    if (isComplete) return;

    // Track statistics and handle review loops
    if (status === 'review' && currentCard) {
      setIncorrectCardIds(prev => [...prev, currentCard.id]);
    }

    setResults(prev => ({
      ...prev,
      [status]: prev[status] + 1
    }));

    setDirection(status === 'mastered' ? 1 : -1);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }, 200);
  };

  // Keyboard shortcut interaction handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isComplete) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowLeft' && isFlipped) {
        e.preventDefault();
        handleNextCard('review');
      } else if (e.code === 'ArrowRight' && isFlipped) {
        e.preventDefault();
        handleNextCard('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isComplete, currentIndex]);

  const handleResetSession = (onlyIncorrect = false) => {
    if (onlyIncorrect && incorrectCardIds.length > 0) {
      const filtered = MOCK_FLASHCARDS.filter(c => incorrectCardIds.includes(c.id));
      setCards(filtered);
    } else {
      setCards(MOCK_FLASHCARDS);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setDirection(0);
    setResults({ mastered: 0, review: 0 });
    setIncorrectCardIds([]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[500px] px-2 select-none">
      
      {/* HEADER & PROGRESS COMPONENT */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-zinc-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm block">Active Recall Deck</span>
            <span className="text-[11px] text-zinc-500 font-medium">Spaced Repetition Engine</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-zinc-300/30 dark:border-white/5">
            {Math.min(currentIndex + 1, cards.length)} / {cards.length} Cards
          </span>
          <div className="flex gap-1.5">
            {cards.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  idx < currentIndex 
                    ? 'bg-blue-500' 
                    : idx === currentIndex 
                      ? 'bg-blue-500/40 dark:bg-blue-400/40 animate-pulse w-8' 
                      : 'bg-zinc-200 dark:bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* MAIN 3D FLASHCARD CANVAS */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] perspective-[1500px]">
        <AnimatePresence mode="popLayout" custom={direction}>
          {!isComplete ? (
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction === 0 ? 0 : direction * 150, scale: 0.95, rotateY: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotateY: isFlipped ? 180 : 0 }}
              exit={{ opacity: 0, x: direction * -150, scale: 0.95, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="absolute inset-0 w-full h-full cursor-pointer preserve-3d"
              onClick={handleFlip}
            >
              {/* FRONT VIEW CONTAINER (TERM) */}
              <div className="absolute inset-0 w-full h-full rounded-3xl border p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-xl dark:shadow-2xl backface-hidden bg-white dark:bg-[#0a0a0c] border-zinc-200 dark:border-white/10">
                <div className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <RotateCw className="w-4 h-4 animate-spin-slow" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-blue-500 dark:text-blue-400 mb-4 bg-blue-500/5 px-2.5 py-1 rounded-md border border-blue-500/10">Concept Token</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3 px-4 leading-tight">
                  {currentCard?.term}
                </h2>
                <p className="text-zinc-400 dark:text-zinc-600 text-xs font-medium mt-4 flex items-center gap-1.5 bg-zinc-100 dark:bg-white/[0.02] px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/5">
                  Click card or press <kbd className="font-sans font-bold bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Space</kbd> to reveal description
                </p>
              </div>

              {/* BACK VIEW CONTAINER (DEFINITION) */}
              <div className="absolute inset-0 w-full h-full rounded-3xl border p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-xl dark:shadow-2xl backface-hidden bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-500/20 rotate-y-180 bg-white dark:bg-[#0a0a0c]">
                <span className="text-xs font-bold tracking-widest uppercase text-purple-500 dark:text-purple-400 mb-6 bg-purple-500/5 px-2.5 py-1 rounded-md border border-purple-500/10">AI Synthesized Context</span>
                <p className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 max-w-xl px-4">
                  {currentCard?.definition}
                </p>
              </div>
            </motion.div>
          ) : (
            // BRAVO / COMPLETION STATE CONTAINER
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 w-full h-full rounded-3xl border p-8 flex flex-col items-center justify-center text-center bg-white dark:bg-[#0a0a0c] border-zinc-200 dark:border-white/10 shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/20 flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Deck Session Complete!</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm leading-relaxed">
                You evaluated <span className="font-bold text-emerald-500 dark:text-emerald-400">{results.mastered} items</span> as mastered. 
                {incorrectCardIds.length > 0 ? (
                  <span> There are <span className="font-bold text-red-500 dark:text-red-400">{incorrectCardIds.length} concepts</span> flagged for review.</span>
                ) : (
                  <span> Excellent recall rate! Perfect loop mastery score achieved.</span>
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
                <Button variant="outline" onClick={() => handleResetSession(false)} className="flex-1 rounded-xl border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold text-sm">
                  <RefreshCw className="w-3.5 h-3.5 mr-2" /> Restart
                </Button>
                {incorrectCardIds.length > 0 && (
                  <Button onClick={() => handleResetSession(true)} className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold rounded-xl text-sm shadow-md">
                    Review Flagged <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTION INTERACTION LAYOUT CONTROLS */}
      <div className="w-full flex flex-col items-center gap-4 mt-8">
        <div className="w-full flex items-center justify-center gap-4">
          <motion.button
            whileHover={isFlipped ? { scale: 1.03 } : {}}
            whileTap={isFlipped ? { scale: 0.97 } : {}}
            onClick={(e) => { e.stopPropagation(); handleNextCard('review'); }}
            disabled={!isFlipped || isComplete}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-red-500/20 text-red-500 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-20 disabled:pointer-events-none shadow-sm"
          >
            <X className="w-4 h-4" />
            <span>Needs Review</span>
          </motion.button>
          
          <motion.button
            whileHover={isFlipped ? { scale: 1.03 } : {}}
            whileTap={isFlipped ? { scale: 0.97 } : {}}
            onClick={(e) => { e.stopPropagation(); handleNextCard('mastered'); }}
            disabled={!isFlipped || isComplete}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all disabled:opacity-20 disabled:pointer-events-none shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Got It</span>
          </motion.button>
        </div>

        {/* CONTROLLER HOTKEY INSTRUCTIONS FOOTER */}
        {!isComplete && (
          <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 px-4 py-2 rounded-xl">
            <span className="flex items-center gap-1"><Keyboard className="w-3.5 h-3.5" /> Shortcuts Available:</span>
            <span><kbd className="bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold">Space</kbd> Flip</span>
            {isFlipped && (
              <>
                <span><kbd className="bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold">←</kbd> Review</span>
                <span><kbd className="bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold">→</kbd> Got It</span>
              </>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}