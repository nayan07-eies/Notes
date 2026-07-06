import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles,} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#09090b] border-t border-white/5 pt-16 pb-8 px-6 sm:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP SECTION: 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Mission (Spans 2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-50">NotelyAI</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              The privacy-first knowledge workspace. Turn your lectures, meetings, and raw notes into structured, interactive study materials using local AI.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 rounded-md bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-zinc-50 hover:bg-white/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-md bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-zinc-50 hover:bg-white/10 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-md bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-zinc-50 hover:bg-white/10 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-zinc-100 uppercase mb-5">Product</h3>
            <ul className="space-y-3.5">
              <li><Link to="/features" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link to="/download" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">Desktop App</Link></li>
              <li><Link to="/changelog" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2">Changelog <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">New</span></Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-zinc-100 uppercase mb-5">Resources</h3>
            <ul className="space-y-3.5">
              <li><Link to="/docs" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">Documentation</Link></li>
              <li><Link to="/api" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">API Reference</Link></li>
              <li><Link to="/blog" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">Blog</Link></li>
              <li><Link to="/community" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-zinc-100 uppercase mb-5">Company</h3>
            <ul className="space-y-3.5">
              <li><Link to="/about" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Status */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} NotelyAI Inc. All rights reserved.
          </p>
          
          {/* Trust Signal: System Status */}
          <a href="/status" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            All systems operational
          </a>
        </div>

      </div>
    </footer>
  );
}