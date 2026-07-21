import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  RefreshCcw,
  GraduationCap
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Mock initial state for the chat
const INITIAL_MESSAGES = [
  { 
    id: '1', 
    role: 'ai', 
    content: "I've completely analyzed your document. We can do a deep-dive Q&A, or I can start testing your knowledge for revision. What would you like to do?" 
  }
];

const QUICK_ACTIONS = [
  { id: 'quiz', label: 'Test my knowledge', icon: HelpCircle },
  { id: 'summarize', label: 'Summarize key points', icon: BookOpen },
  { id: 'explain', label: 'Explain Optimistic UI', icon: Sparkles }
];

// Fallback icon for HelpCircle since it might not be imported above
import { HelpCircle } from 'lucide-react';

export default function TutorChatModule() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    const userMessage = text || inputValue;
    if (!userMessage.trim()) return;

    // 1. Add User Message
    const newUserMsg = { id: Date.now().toString(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Simulate AI Processing & Streaming Response
    setTimeout(() => {
      const aiResponseId = (Date.now() + 1).toString();
      
      // Determine mock response based on user input
      let fullResponse = "That's a great question. Based on the document, Optimistic UI is a pattern where the frontend updates instantly before the server responds, hiding network latency from the user. Does that make sense, or should we revise this further?";
      
      if (userMessage.toLowerCase().includes('test') || userMessage.toLowerCase().includes('revise')) {
        fullResponse = "Let's revise! Question 1: What is the primary difference between a Vector Database and a standard relational database when handling LLM queries?";
      }

      // Add empty AI message first
      setMessages(prev => [...prev, { id: aiResponseId, role: 'ai', content: '' }]);
      
      // Stream the words in
      const words = fullResponse.split(' ');
      let currentWordIndex = 0;

      const streamInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
          setMessages(prev => prev.map(msg => {
            if (msg.id === aiResponseId) {
              return { ...msg, content: msg.content + (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex] };
            }
            return msg;
          }));
          currentWordIndex++;
        } else {
          clearInterval(streamInterval);
          setIsTyping(false);
        }
      }, 50); // Speed of streaming

    }, 1000); // Initial "thinking" delay
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] bg-[#0a0a0c] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col shadow-2xl">
      
      {/* 1. HEADER */}
      <div className="px-6 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <GraduationCap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-50">Interactive Study Tutor</h3>
            <p className="text-xs text-zinc-500">Document Context Active</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMessages(INITIAL_MESSAGES)} className="text-zinc-400 hover:text-white h-8">
          <RefreshCcw className="w-4 h-4 mr-2" /> Reset Session
        </Button>
      </div>

      {/* 2. CHAT MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className="shrink-0 mt-1">
                  {msg.role === 'ai' ? (
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 text-zinc-100' 
                    : 'bg-white/[0.03] border border-white/5 text-zinc-300'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-1.5 h-[52px]">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT AREA & QUICK ACTIONS */}
      <div className="p-4 border-t border-white/5 bg-[#09090b]">
        
        {/* Quick Actions (Only show if chat is short to encourage interaction) */}
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 mb-4 px-2">
            {QUICK_ACTIONS.map(action => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleSendMessage(action.label)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 hover:bg-white/10 transition-colors text-xs font-medium text-zinc-300"
                >
                  <ActionIcon className="w-3.5 h-3.5" />
                  {action.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Chat Input */}
        <div className="relative flex items-end gap-2 bg-black/50 border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or type 'test me'..."
            className="w-full max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-sm text-zinc-100 placeholder-zinc-600 px-3 py-3 scrollbar-hide"
            rows={1}
          />
          <Button 
            onClick={() => handleSendMessage()} 
            disabled={!inputValue.trim() || isTyping}
            className="shrink-0 h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center p-0 transition-colors disabled:opacity-50 disabled:bg-white/10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-3 font-medium">
          AI Tutor can make mistakes. Always verify important information.
        </p>
      </div>

    </div>
  );
}