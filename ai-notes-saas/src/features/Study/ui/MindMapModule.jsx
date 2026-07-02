import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Download, 
  Share2,
  Database,
  Layout,
  Cpu,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { header } from 'framer-motion/client';

// --- KNOWLEDGE GRAPH DATA ---
// Based on the MOCK_AI_SUMMARY from the Workspace
const GRAPH_DATA = {
  nodes: [
    { id: 'root', label: 'Modern AI Architecture', x: 400, y: 250, type: 'core', icon: Network, color: 'from-blue-500 to-purple-600' },
    { id: 'frontend', label: 'Optimistic UI', x: 150, y: 120, type: 'concept', icon: Layout, color: 'from-emerald-400 to-emerald-600' },
    { id: 'latency', label: 'Hides Latency', x: 50, y: 280, type: 'detail', icon: Zap, color: 'from-zinc-500 to-zinc-600' },
    { id: 'backend', label: 'Vector Databases', x: 650, y: 120, type: 'concept', icon: Database, color: 'from-orange-400 to-orange-600' },
    { id: 'llm', label: 'LLM Context', x: 750, y: 280, type: 'detail', icon: Cpu, color: 'from-zinc-500 to-zinc-600' },
    { id: 'semantics', label: 'Semantic Search', x: 550, y: 380, type: 'detail', icon: Network, color: 'from-zinc-500 to-zinc-600' }
  ],
  edges: [
    { source: 'root', target: 'frontend' },
    { source: 'frontend', target: 'latency' },
    { source: 'root', target: 'backend' },
    { source: 'backend', target: 'llm' },
    { source: 'backend', target: 'semantics' },
  ]
};

export default function MindMapModule() {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Helper to draw smooth curvy lines between nodes
  const drawEdge = (sourceId, targetId) => {
    const sourceNode = GRAPH_DATA.nodes.find(n => n.id === sourceId);
    const targetNode = GRAPH_DATA.nodes.find(n => n.id === targetId);
    
    if (!sourceNode || !targetNode) return null;

    // Control points for a cubic bezier curve to make lines look organic
    const midY = (sourceNode.y + targetNode.y) / 2;
    const path = `M ${sourceNode.x} ${sourceNode.y} C ${sourceNode.x} ${midY}, ${targetNode.x} ${midY}, ${targetNode.x} ${targetNode.y}`;

    return (
      <motion.path
        key={`${sourceId}-${targetId}`}
        d={path}
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    );
  };

  return (
    <div className="w-full h-[600px] bg-[#0a0a0c] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col shadow-2xl">
      
      {/* 1. HEADER OVERLAY */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Network className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-50 tracking-tight">Concept Map</h3>
            <p className="text-xs text-zinc-500 font-medium">Generated from Document</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Button variant="outline" size="sm" className="h-9 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button size="sm" className="h-9 bg-zinc-50 text-[#09090b] hover:bg-zinc-200">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* 2. THE CANVAS (Interactive Graph) */}
      <div 
        className="flex-1 relative cursor-grab active:cursor-grabbing"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
        />

        {/* Scalable Container */}
        <motion.div 
          className="w-full h-full relative"
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* SVG Layer for Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            {GRAPH_DATA.edges.map(edge => drawEdge(edge.source, edge.target))}
          </svg>

          {/* HTML Layer for Nodes */}
          {GRAPH_DATA.nodes.map((node, index) => {
            const Icon = node.icon;
            const isCore = node.type === 'core';
            
            return (
              <motion.div
                key={node.id}
                // Allow nodes to be dragged within the container for interactivity
                drag
                dragConstraints={{ left: 0, right: 800, top: 0, bottom: 600 }}
                dragElastic={0.1}
                dragMomentum={false}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                className="absolute z-10"
                style={{ 
                  left: node.x, 
                  top: node.y,
                  // Center the element exactly on its x,y coordinates
                  x: '-50%',
                  y: '-50%' 
                }}
              >
                {/* Node Card */}
                <div className={`
                  flex items-center gap-3 p-3 pr-5 rounded-2xl shadow-xl backdrop-blur-xl border transition-colors cursor-pointer
                  ${isCore 
                    ? 'bg-zinc-950/80 border-white/20 hover:border-white/40' 
                    : 'bg-[#09090b]/60 border-white/10 hover:border-white/30'
                  }
                `}>
                  {/* Icon Wrapper with Dynamic Gradient */}
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${node.color} shadow-inner`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Label */}
                  <span className={`font-medium tracking-tight ${isCore ? 'text-zinc-50 text-sm' : 'text-zinc-300 text-xs'}`}>
                    {node.label}
                  </span>

                  {/* Core Node Pulse Ring */}
                  {isCore && (
                    <span className="absolute inset-0 rounded-2xl border border-blue-500 animate-ping opacity-20" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 3. FLOATING TOOLBAR (Zoom & Focus Controls) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center p-1.5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <Button variant="ghost" size="icon" onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))} className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl h-10 w-10">
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-white/10 mx-1" />
          <span className="px-3 text-xs font-medium text-zinc-500 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <div className="w-px h-6 bg-white/10 mx-1" />
          
          <Button variant="ghost" size="icon" onClick={() => setScale(prev => Math.min(2, prev + 0.2))} className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl h-10 w-10">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setScale(1)} className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl h-10 w-10 ml-1">
            <Maximize className="w-4 h-4" />
          </Button>
        </motion.div>
        <p className='mt-5'>This is a demo </p>
      </div>

    </div>
  );
}