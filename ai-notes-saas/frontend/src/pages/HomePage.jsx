import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Mic, Video, BrainCircuit, Sparkles, ArrowRight, ChevronLeft,
  ChevronRight, Layers, FileQuestion, Network, Bot, Search, LayoutTemplate
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import Footer from '../shared/ui/Footer';

const MOCK_REVIEWS = [
  { name: "Sarah K.", role: "BioMed Undergrad", quote: "Turned a 45-slide confusing PowerPoint deck into matching flashcards in literally 5 seconds. Absolute life saver for finals.", metric: "Saved 8+ hours/week" },
  { name: "Alex M.", role: "Computer Science Senior", quote: "The AI Tutor breakdown of complex distributed microservices architecture helped me pull off an A on my midterm exam.", metric: "GPA boosted by 0.4" },
  { name: "Jessica T.", role: "Law Student", quote: "Giant PDF reading transcripts no longer scare me. Clean note outlines strip the fluff instantly.", metric: "150+ pages summarized" }
];

const FEATURES_DATA = [
  { icon: Layers, title: "Magic Flashcards", desc: "Instantly turn any lecture into a deck of flashcards. Swipe through concepts until they stick.", color: "text-blue-500 bg-blue-500/5 border-blue-500/10" },
  { icon: FileQuestion, title: "Practice Quizzes", desc: "Test yourself before the exam does. We generate custom multiple-choice quizzes from your notes.", color: "text-purple-500 bg-purple-500/5 border-purple-500/10" },
  { icon: Network, title: "Visual Mind Maps", desc: "Visual learner? See how all the big concepts connect so you actually understand the topic.", color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" },
  { icon: Bot, title: "Your 24/7 AI Tutor", desc: "Stuck on a hard topic? Chat with your notes directly and get simple, easy-to-understand answers.", color: "text-indigo-500 bg-indigo-500/5 border-indigo-500/10" },
  { icon: Search, title: "Find Anything Instantly", desc: "Forgot what that one theory means? Search your entire library of notes in a split second.", color: "text-pink-500 bg-pink-500/5 border-pink-500/10" },
  { icon: LayoutTemplate, title: "Clean Note Formatting", desc: "Say goodbye to giant walls of text. We format everything into neat, digestible bullet points.", color: "text-orange-500 bg-orange-500/5 border-orange-500/10" },
];

export default function HomePage() {
  const [currentReview, setCurrentReview] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);

  // Responsive max bounds calculation for the 6 features
  // (Desktop shows 3, meaning max index is 3. Mobile shows 1, meaning max index is 5)
  const nextFeature = () => {
    setFeatureIndex((prev) => (prev >= FEATURES_DATA.length - 1 ? 0 : prev + 1));
  };

  const prevFeature = () => {
    setFeatureIndex((prev) => (prev === 0 ? FEATURES_DATA.length - 1 : prev - 1));
  };

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % MOCK_REVIEWS.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + MOCK_REVIEWS.length) % MOCK_REVIEWS.length);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 flex flex-col justify-between overflow-x-hidden relative transition-colors duration-300 select-none">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* --- HERO PLATFORM COMPILATION ZONE --- */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-20 pb-12 z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Copy & Call to Action */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-500/20"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Your ultimate last-minute study buddy</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight"
          >
            Turn long lectures into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              instant notes.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            Stop re-watching boring 2-hour videos. Upload your messy PDFs, lecture recordings, or YouTube links, and let AI instantly create flashcards, quizzes, and easy-to-read summaries.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button size="lg" className="h-14 px-8 text-base bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.99]" asChild>
              <Link to="/signup">
                Start Studying Faster <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white/50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 backdrop-blur-sm rounded-xl font-bold transition-all" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Animation Core Engine */}
        <div className="relative w-full flex items-center justify-center min-h-[360px] lg:min-h-[400px]">
          <motion.div 
            animate={{ 
              boxShadow: [
                "0px 0px 0px 0px rgba(59, 130, 246, 0.2)", 
                "0px 0px 60px 20px rgba(59, 130, 246, 0.4)", 
                "0px 0px 0px 0px rgba(59, 130, 246, 0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-20 w-32 h-32 bg-white dark:bg-[#0a0a0c] border-4 border-blue-500 dark:border-blue-400 rounded-3xl flex items-center justify-center shadow-2xl transition-colors duration-300"
          >
            {/* <BrainCircuit className="w-16 h-16 text-blue-500 dark:text-blue-400" /> */}
            
            <img
            src="/ulight_logo-removebg-preview.png"
            className="w-30 h-30 object-contain text-blue-500 dark:text-blue-400"
            />
          </motion.div>

          {/* Raw Data Streams Inverting Left In */}
          <motion.div animate={{ x: [ -160, 0 ], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }} transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }} className="absolute left-0 z-10 p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 backdrop-blur-md shadow-md">
            <Video className="w-6 h-6" />
          </motion.div>
          <motion.div animate={{ x: [ -130, 0 ], y: [-90, 0], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }} transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: 0.9 }} className="absolute left-8 top-16 z-10 p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 backdrop-blur-md shadow-md">
            <FileText className="w-6 h-6" />
          </motion.div>
          <motion.div animate={{ x: [ -130, 0 ], y: [90, 0], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }} transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: 1.8 }} className="absolute left-8 bottom-16 z-10 p-4 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-md">
            <Mic className="w-6 h-6" />
          </motion.div>

          {/* Structured Core Modules Output Fluidly */}
          <motion.div animate={{ x: [ 0, 160 ], opacity: [0, 1, 0], scale: [0.6, 1, 1.1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: 0.5 }} className="absolute right-0 z-10 p-4 bg-blue-500/10 dark:bg-white/[0.02] text-blue-500 dark:text-blue-400 rounded-xl border border-blue-500/20 dark:border-white/5 backdrop-blur-md flex flex-col gap-2 w-36 shadow-sm">
            <div className="h-1.5 w-3/4 bg-blue-500/40 dark:bg-blue-400/40 rounded-full" />
            <div className="h-1.5 w-full bg-blue-500/20 dark:bg-blue-400/20 rounded-full" />
          </motion.div>
          <motion.div animate={{ x: [ 0, 140 ], y: [0, -80], opacity: [0, 1, 0], scale: [0.6, 1, 1.1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: 1.4 }} className="absolute right-2 top-20 z-10 p-4 bg-purple-500/10 dark:bg-white/[0.02] text-purple-500 dark:text-purple-400 rounded-xl border border-purple-500/20 dark:border-white/5 backdrop-blur-md flex flex-col gap-2 w-32 shadow-sm">
            <div className="h-1.5 w-full bg-purple-500/40 dark:bg-purple-400/40 rounded-full" />
            <div className="h-1.5 w-4/5 bg-purple-500/20 dark:bg-purple-400/20 rounded-full" />
          </motion.div>
        </div>       
      </div>    

      {/* --- RELATABLE STATS BLOCK --- */}
      <div className="max-w-6xl w-full mx-auto px-6 py-6 border-y border-zinc-200/60 dark:border-white/5 z-10 bg-white/20 dark:bg-white/[0.002] backdrop-blur-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "Seconds", label: "To Generate Notes" },
            { value: "100%", label: "Exam Focus" },
            { value: "0", label: "All-Nighters Needed" },
            { value: "4x", label: "Faster Memorization" }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 font-mono">{stat.value}</div>
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- REFACTORED INTERACTIVE FEATURE SLIDER BLOCK --- */}
      <div className="max-w-6xl w-full mx-auto px-6 py-20 z-10 space-y-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
              Everything you need to cram effectively.
            </h2>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Upload the material. Let the AI do the heavy lifting. Swipe or click to view engine toolkits.
            </p>
          </div>
          
          {/* Slider Pagination Controls */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <Button size="icon" variant="outline" onClick={prevFeature} className="w-9 h-9 rounded-xl border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={nextFeature} className="w-9 h-9 rounded-xl border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Outer Carousel Container Window */}
        <div className="overflow-hidden w-full relative py-2">
          <motion.div 
            animate={{ x: `-${featureIndex * (100 / 3)}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="flex gap-4 w-full md:[&>div]:min-w-[calc(33.333%-11px)] sm:[&>div]:min-w-[calc(50%-8px)] [&>div]:min-w-full"
          >
            {FEATURES_DATA.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i} 
                  className="p-6 border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0c] rounded-2xl flex flex-col gap-4 text-left transition-all hover:border-zinc-300 dark:hover:border-white/10 group hover:shadow-md h-full select-none"
                >
                  <div className={`p-3 rounded-xl border w-fit ${feature.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 tracking-tight">{feature.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Progress Indicator Dots */}
        <div className="flex justify-center gap-1.5 pt-2">
          {Array.from({ length: FEATURES_DATA.length - 2 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setFeatureIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${featureIndex === idx ? 'w-6 bg-blue-500' : 'w-1.5 bg-zinc-300 dark:bg-zinc-800'}`}
            />
          ))}
        </div>
      </div>

      {/* --- STUDENT REVIEW SLIDER MODULE --- */}
      <div className="max-w-4xl w-full mx-auto px-6 pb-24 z-10">
        <div className="border border-zinc-200 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0c]/70 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex-1 space-y-4 w-full">
            <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase bg-blue-500/5 px-2.5 py-1 rounded-md border border-blue-500/10">Real Student Results</span>
            <div className="min-h-[100px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2"
                >
                  <p className="text-lg sm:text-xl font-medium tracking-tight text-zinc-800 dark:text-zinc-200 leading-snug italic">
                    "{MOCK_REVIEWS[currentReview].quote}"
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">{MOCK_REVIEWS[currentReview].name}</span>
                    <span className="text-zinc-400 dark:text-zinc-500">•</span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">{MOCK_REVIEWS[currentReview].role}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-white/5 pt-4 sm:pt-0 sm:pl-8 shrink-0">
            <div className="text-left sm:text-right space-y-0.5">
              <div className="text-sm font-bold text-emerald-500 font-mono tracking-tight">{MOCK_REVIEWS[currentReview].metric}</div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Outcome Verified</div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="icon" variant="outline" onClick={prevReview} className="w-8 h-8 rounded-lg border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={nextReview} className="w-8 h-8 rounded-lg border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer /> 
    </div>
  );
}