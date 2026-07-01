import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  RotateCw, 
  X, 
  Check, 
  BrainCircuit,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_FLASHCARDS = [
  { id: 1, term: 'Latent Space', definition: 'A compressed, multi-dimensional representation of data where similar items are mapped closer together, foundational for AI models.' },
  { id: 2, term: 'Optimistic UI', definition: 'A frontend pattern that updates the UI instantly assuming a successful backend response, hiding network latency from the user.' },
  { id: 3, term: 'Spaced Repetition', definition: 'A learning technique that incorporates increasing intervals of time between subsequent reviews of previously learned material.' },
  { id: 4, term: 'Vector Embeddings', definition: 'Numerical arrays representing the semantic meaning of text, allowing search engines to find concepts rather than just matching keywords.' }
];

export default function FlashcardModule() {
  const [cards] = useState(MOCK_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left (review), 1 for right (mastered)
  const [results, setResults] = useState({ mastered: 0, review: 0 });

  const currentCard = cards[currentIndex];
  const isComplete = currentIndex >= cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = (status) => {
    // Prevent action while animating
    if (isComplete) return;

    // Track stats
    setResults(prev => ({
      ...prev,
      [status]: prev[status] + 1
    }));

    // Trigger exit animation direction
    setDirection(status === 'mastered' ? 1 : -1);
    
    // Slight delay to allow swipe animation to play before resetting flip state
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }, 200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[500px]">
      
      {/* Header & Progress */}
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-zinc-400">
          <BrainCircuit className="w-5 h-5 text-blue-400" />
          <span className="font-medium">Active Recall Session</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-zinc-500">
            {Math.min(currentIndex + 1, cards.length)} / {cards.length}
          </span>
          <div className="flex gap-1">
            {cards.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${
                  idx < currentIndex 
                    ? 'bg-blue-500' 
                    : idx === currentIndex 
                      ? 'bg-blue-500/40 animate-pulse' 
                      : 'bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Card Arena */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-[1500px]">
        <AnimatePresence mode="popLayout" custom={direction}>
          {!isComplete ? (
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction === 0 ? 0 : direction * 100, scale: 0.9, rotateY: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotateY: isFlipped ? 180 : 0 }}
              exit={{ opacity: 0, x: direction * -100, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute inset-0 w-full h-full cursor-pointer [transform-style:preserve-3d]"
              onClick={handleFlip}
            >
              {/* Front of Card (Term) */}
              <div className="absolute inset-0 w-full h-full rounded-3xl bg-zinc-900 border border-white/10 p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl [backface-visibility:hidden]">
                <div className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-zinc-500">
                  <RotateCw className="w-4 h-4" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  {currentCard?.term}
                </h2>
                <p className="text-zinc-500 text-sm font-medium">Click card to reveal answer</p>
              </div>

              {/* Back of Card (Definition) */}
              <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-200">
                  {currentCard?.definition}
                </p>
              </div>
            </motion.div>
          ) : (
            // Completion Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 w-full h-full rounded-3xl bg-zinc-900 border border-white/10 p-8 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
              <p className="text-zinc-400 mb-8 max-w-sm">
                You've mastered {results.mastered} concepts. {results.review > 0 && `You have ${results.review} cards left to review.`}
              </p>
              
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.location.reload()} className="border-white/10 hover:bg-white/5">
                  Back to Hub
                </Button>
                <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-6">
                  Review Incorrect
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Controls */}
      <div className="w-full flex items-center justify-center gap-6 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); handleNextCard('review'); }}
          disabled={!isFlipped || isComplete}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-zinc-900 border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <X className="w-5 h-5" />
          Needs Review
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); handleNextCard('mastered'); }}
          disabled={!isFlipped || isComplete}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-zinc-900 border border-emerald-500/20 text-emerald-400 font-semibold hover:bg-emerald-500/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <Check className="w-5 h-5" />
          Got It
        </motion.button>
      </div>
      
    </div>
  );
}