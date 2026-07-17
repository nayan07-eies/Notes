import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Palette, Type } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  
  // CRITICAL: We need a ref to store the highlighted text
  const savedSelection = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // 1. SAVE the user's highlight every time they click or type
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0);
    }
  };

  // 2. RESTORE the highlight right before formatting
  const restoreSelection = () => {
    if (savedSelection.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
  };

  const formatText = (command, commandValue = null) => {
    // Bring the highlight back before executing the command!
    restoreSelection(); 
    
    document.execCommand(command, false, commandValue);
    editorRef.current.focus();
    
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    saveSelection(); // Save cursor position while typing
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Prevent focus loss for normal buttons
  const preventFocusLoss = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* TOOLBAR */}
      <div className="flex items-center gap-1 p-1.5 w-fit rounded-xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-lg sticky top-0 z-10">
        
        {/* Bold, Italic, Underline */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
          <button 
            onMouseDown={preventFocusLoss} 
            onClick={() => formatText('bold')} 
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-white/10 transition-colors" 
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button 
            onMouseDown={preventFocusLoss} 
            onClick={() => formatText('italic')} 
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-white/10 transition-colors" 
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button 
            onMouseDown={preventFocusLoss} 
            onClick={() => formatText('underline')} 
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-white/10 transition-colors" 
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Font Family Dropdown */}
        <div className="flex items-center border-r border-white/10 pr-2 mr-1">
          <Type className="w-4 h-4 text-zinc-500 ml-2 mr-1" />
          {/* Note: Removed preventDefault here so the dropdown can open properly */}
          <select 
            onChange={(e) => formatText('fontName', e.target.value)}
            className="bg-transparent text-sm text-zinc-300 outline-none cursor-pointer hover:text-zinc-50 py-1 px-2 rounded-lg hover:bg-white/10"
          >
            <option value="Inter, sans-serif" className="bg-[#09090b]">Sans-Serif</option>
            <option value="Georgia, serif" className="bg-[#09090b]">Serif</option>
            <option value="monospace" className="bg-[#09090b]">Monospace</option>
          </select>
        </div>

        {/* Font Size Dropdown */}
        <div className="flex items-center border-r border-white/10 pr-2 mr-1">
          <select 
            onChange={(e) => formatText('fontSize', e.target.value)}
            className="bg-transparent text-sm text-zinc-300 outline-none cursor-pointer hover:text-zinc-50 py-1 px-2 rounded-lg hover:bg-white/10"
            defaultValue="3"
          >
            <option value="1" className="bg-[#09090b]">Small</option>
            <option value="3" className="bg-[#09090b]">Normal</option>
            <option value="5" className="bg-[#09090b]">Large</option>
            <option value="7" className="bg-[#09090b]">Huge</option>
          </select>
        </div>

        {/* Color Picker */}
        <div className="flex items-center relative group">
          <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-white/10 transition-colors overflow-hidden relative">
            <Palette className="w-4 h-4" />
            <input 
              type="color" 
              onChange={(e) => formatText('foreColor', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Text Color"
            />
          </button>
        </div>

      </div>

      {/* EDITABLE CANVAS */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={saveSelection}       // Capture highlight when using keyboard (Shift + Arrows)
        onMouseUp={saveSelection}     // Capture highlight when using mouse
        onMouseLeave={saveSelection}  // Capture highlight if they drag mouse outside box
        className="w-full text-base sm:text-lg text-zinc-300 leading-relaxed outline-none min-h-[500px] pb-32 focus:ring-0"
        data-placeholder={placeholder}
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
    </div>
  );
}