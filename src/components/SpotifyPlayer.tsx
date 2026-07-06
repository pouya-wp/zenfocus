import React from 'react';
import { Music, X, AlertCircle } from 'lucide-react';

interface SpotifyPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  isDark: boolean;
}

export default function SpotifyPlayer({ isOpen, onClose, accentColor, isDark }: SpotifyPlayerProps) {
  
  // متصل کردن مستقیم آی‌فریم به اندپوینت پروکسیِ ورسل شما
  // این آدرس، هدرهای ضد آی‌فریمِ لینک اصلی شما رو برمی‌داره
  const proxiedSrc = "/api/proxy";

  return (
    <div
      style={{ display: isOpen ? 'flex' : 'none' }}
      className={`fixed inset-0 z-50 items-center justify-center pointer-events-none p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div
        className={`w-full max-w-2xl rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col h-[520px] transition-all duration-500 ${
          isDark ? 'glass-panel text-gray-100' : 'glass-panel-light text-gray-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 dark:border-black/5 bg-white/5 dark:bg-black/5">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl flex items-center justify-center animate-pulse"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              <Music size={20} />
            </div>
            <div>
              <h3 className="font-sora font-semibold text-lg tracking-tight">Ambient Audio Sanctuary</h3>
              <p className="text-xs opacity-60 font-mono">Spotify Persistent Player</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors cursor-pointer"
            title="Minimize (Keep Music Playing!)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden p-6">
          <div className="flex-1 rounded-[1.8rem] overflow-hidden bg-black/10 dark:bg-white/5 backdrop-blur-sm relative h-full w-full">
            <iframe
              src={proxiedSrc}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Ambient Player"
              className="w-full h-full rounded-[1.8rem] opacity-90 hover:opacity-100 transition-opacity duration-300 absolute inset-0"
              style={{ 
                height: '100%', 
                minHeight: '100%',
                border: 'none'
              }}
            ></iframe>
          </div>

          {/* Note about playback */}
          <div className={`mt-4 p-3 rounded-2xl flex gap-2 items-start text-xs leading-relaxed ${
            isDark ? 'bg-white/5' : 'bg-black/5'
          }`}>
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-400" />
            <p className="opacity-75">
              Note: Standard iframe browser security requires logging into your Spotify account in this browser window to play full songs instead of previews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
