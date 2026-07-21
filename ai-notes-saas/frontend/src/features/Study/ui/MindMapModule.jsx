import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
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
  Zap,
  RefreshCw,
  Check,
  Hand
} from 'lucide-react';
import { Button } from '/Project/ai-notes-saas/frontend/src/components/ui/button';

// --- SYSTEM NODES ARCHITECTURE (Adjusted coordinates to stay safe inside 100% viewport grids) ---
const INITIAL_GRAPH_DATA = {
  nodes: [
    { id: 'root', label: 'Modern AI Architecture', x: 350, y: 260, type: 'core', icon: Network, color: 'from-blue-500 to-purple-600' },
    { id: 'frontend', label: 'Optimistic UI', x: 160, y: 140, type: 'concept', icon: Layout, color: 'from-emerald-400 to-emerald-600' },
    { id: 'latency', label: 'Hides Latency', x: 60, y: 260, type: 'detail', icon: Zap, color: 'from-zinc-500 to-zinc-600' },
    { id: 'backend', label: 'Vector Databases', x: 540, y: 140, type: 'concept', icon: Database, color: 'from-orange-400 to-orange-600' },
    { id: 'llm', label: 'LLM Context', x: 640, y: 260, type: 'detail', icon: Cpu, color: 'from-zinc-500 to-zinc-600' },
    { id: 'semantics', label: 'Semantic Search', x: 480, y: 380, type: 'detail', icon: Network, color: 'from-zinc-500 to-zinc-600' }
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
  const isDarkMode = useSelector((state) => state.ui?.isDarkMode || false);
  const [scale, setScale] = useState(1);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  
  const canvasBoundsRef = useRef(null);
  const dragPlaneRef = useRef(null);

  // Infinite Canvas Pan Coordinates
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  // Track Node Position mutations reactively
  const [nodePositions, setNodePositions] = useState(
    INITIAL_GRAPH_DATA.nodes.reduce((acc, node) => {
      acc[node.id] = { x: node.x, y: node.y };
      return acc;
    }, {})
  );

  // Recalculates paths fluidly on-drag factoring scale transformations
  const handleNodeDrag = (nodeId, info) => {
    setNodePositions(prev => ({
      ...prev,
      [nodeId]: {
        x: prev[nodeId].x + info.delta.x / scale,
        y: prev[nodeId].y + info.delta.y / scale
      }
    }));
  };

  const resetCanvas = () => {
    setScale(1);
    panX.set(0);
    panY.set(0);
    setNodePositions(
      INITIAL_GRAPH_DATA.nodes.reduce((acc, node) => {
        acc[node.id] = { x: node.x, y: node.y };
        return acc;
      }, {})
    );
  };

  const handleClientExport = () => {
    try {
      const exportText = INITIAL_GRAPH_DATA.nodes
        .map(node => `[${node.type.toUpperCase()}] ${node.label} (${node.id})`)
        .join('\n');
        
      const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.setAttribute('download', 'NoteAI_Concept_Map.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Local file download vector execution failed:", err);
    }
  };

  // const handleClientShareLink = async () => {
  //   try {
  //     const shareUrl = `${window.location.origin}/shared/mindmap-matrix-preview`;
  //     await navigator.clipboard.writeText(shareUrl);
  //     setIsLinkCopied(true);
  //     setTimeout(() => setIsLinkCopied(false), 2000);
  //   } catch (err) {
  //     console.error("Clipboard routing vector exception:", err);
  //   }
  // };

  const drawEdge = (sourceId, targetId) => {
    const source = nodePositions[sourceId];
    const target = nodePositions[targetId];
    
    if (!source || !target) return null;

    const midY = (source.y + target.y) / 2;
    const path = `M ${source.x} ${source.y} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y}`;

    return (
      <path
        key={`${sourceId}-${targetId}`}
        d={path}
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth="2.5"
        className="opacity-30 dark:opacity-20 transition-all duration-75"
      />
    );
  };

  return (
    <div 
      ref={canvasBoundsRef}
      className={`w-full h-[580px] sm:h-[620px] border rounded-3xl relative overflow-hidden flex flex-col shadow-xl select-none transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0a0a0c] border-white/5 shadow-black/40' : 'bg-white border-zinc-200 shadow-zinc-200/40'
      }`}
    >
      
      {/* 1. HEADER BRAND BAR PANE */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="p-2 rounded-xl bg-white/90 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-xs shrink-0">
            <Network className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div className="truncate">
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">Dynamic Concept Vector Map</h3>
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">Interactive Spatial Knowledge Nodes</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto self-end sm:self-auto shrink-0">
          {/* <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClientShareLink}
            className="h-8 rounded-xl text-[11px] font-semibold bg-white/90 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
          >
            {isLinkCopied ? <Check className="w-3 h-3 mr-1.5 text-emerald-500" /> : <Share2 className="w-3 h-3 mr-1.5" />} 
            <span>{isLinkCopied ? 'Copied Link!' : 'Share Map'}</span>
          </Button> */}
          <Button 
            size="sm" 
            onClick={handleClientExport}
            className="h-8 rounded-xl text-[11px] font-bold bg-zinc-900 dark:bg-zinc-50 text-white dark:text-[#09090b] hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs"
          >
            <Download className="w-3 h-3 mr-1.5" /> Export Map
          </Button>
        </div>
      </div>

      {/* 2. INFINITE PAN AND INFINITE GRAPH FIELD CANVAS */}
      <motion.div 
        ref={dragPlaneRef}
        drag
        dragMomentum={false}
        style={{ x: panX, y: panY }}
        className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing touch-none z-10"
      >
        {/* Infinite Grid Background Matrix layer */}
        <div className="absolute -inset-[2000px] opacity-[0.05] dark:opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1.5px, transparent 0)', 
            backgroundSize: '28px 24px' 
          }} 
        />

        {/* Scalable Container wrapper */}
        <motion.div 
          className="w-full h-full relative"
          style={{ transformOrigin: 'center center' }}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        >
          {/* Vector SVGs Layer lines */}
          <svg className="absolute inset-0 w-[2000px] h-[2000px] pointer-events-none z-0 overflow-visible">
            <defs>
              <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {INITIAL_GRAPH_DATA.edges.map(edge => drawEdge(edge.source, edge.target))}
          </svg>

          {/* Interactive HTML Layer Nodes */}
          {INITIAL_GRAPH_DATA.nodes.map((node) => {
            const Icon = node.icon;
            const isCore = node.type === 'core';
            const pos = nodePositions[node.id] || { x: node.x, y: node.y };
            
            return (
              <motion.div
                key={node.id}
                drag
                dragMomentum={false}
                onDrag={(e, info) => handleNodeDrag(node.id, info)}
                className="absolute z-20"
                style={{ 
                  left: pos.x, 
                  top: pos.y,
                  x: '-50%',
                  y: '-50%' 
                }}
                whileDrag={{ scale: 1.05 }}
              >
                <div className={`
                  flex items-center gap-2.5 p-2 sm:p-2.5 pr-3 sm:pr-4 rounded-xl shadow-md border transition-all cursor-grab active:cursor-grabbing relative group max-w-[160px] sm:max-w-none
                  ${isCore 
                    ? 'bg-zinc-900/95 dark:bg-zinc-950/90 border-zinc-700/60 dark:border-white/20 shadow-black/20' 
                    : 'bg-white/95 dark:bg-[#09090b]/80 border-zinc-200 dark:border-white/10 shadow-zinc-200/10 dark:shadow-none'
                  }
                `}>
                  <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br shadow-inner shrink-0 ${node.color}`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  
                  <span className={`font-bold tracking-tight truncate ${
                    isCore 
                      ? 'text-white text-xs sm:text-sm' 
                      : 'text-zinc-700 dark:text-zinc-300 text-[10px] sm:text-xs'
                  }`}>
                    {node.label}
                  </span>

                  {isCore && (
                    <span className="absolute inset-0 rounded-xl border border-blue-500 animate-ping opacity-15 pointer-events-none" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* 3. VIEWPORT NAVIGATION CONTROL CONTROLLER PANELS */}
      <div className="absolute bottom-4 inset-x-0 mx-auto z-30 flex flex-col items-center gap-2 w-full max-w-[280px] px-4 pointer-events-none">
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center p-1 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 backdrop-blur-xl shadow-xl w-full justify-between pointer-events-auto"
        >
          <Button variant="ghost" size="icon" onClick={() => setScale(prev => Math.max(0.4, prev - 0.15))} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-xl h-8 w-8 shrink-0">
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          
          <div className="w-px h-4 bg-zinc-200 dark:bg-white/10" />
          <span className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <div className="w-px h-4 bg-zinc-200 dark:bg-white/10" />
          
          <Button variant="ghost" size="icon" onClick={() => setScale(prev => Math.min(1.8, prev + 0.15))} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-xl h-8 w-8 shrink-0">
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={resetCanvas} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-xl h-8 w-8 shrink-0" title="Reset Viewport Matrix">
            <RefreshCw className="w-3 h-3" />
          </Button>
        </motion.div>
        
        <span className="text-[9px] font-bold tracking-wide text-zinc-400 dark:text-zinc-500 bg-white/80 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-white/5 px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs text-center leading-tight">
          🖐️ Drag background to pan • Drag nodes to restack
        </span>
      </div>

    </div>
  );
}