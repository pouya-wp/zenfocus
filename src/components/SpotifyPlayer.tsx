import React, { useState, useEffect } from 'react';
import { Music, RefreshCw, X, ChevronRight, AlertCircle } from 'lucide-react';

interface SpotifyPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  isDark: boolean;
}

export default function SpotifyPlayer({ isOpen, onClose, accentColor, isDark }: SpotifyPlayerProps) {
  const [playlistInput, setPlaylistInput] = useState('');
  
  // دقیقاً همان لینک پیش‌فرض اولیه‌ی خودت بدون تغییر هاست‌نیم
  const [playlistUrl, setPlaylistUrl] = useState(() => {
    return localStorage.getItem('zenclock_spotify_playlistUrl') || 
      'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb9Cj9P7s?utm_source=generator&theme=0';
  });
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('zenclock_spotify_playlistUrl', playlistUrl);
  }, [playlistUrl]);

  // این تابع بدون دستکاری دامنه، فقط فرمت مسیر و پارامتر سایز رو اصلاح می‌کنه
  const formatSpotifyEmbedUrl = (rawUrl: string): string => {
    let cleaned = rawUrl.trim();
    const urlObj = new URL(cleaned);
    let pathname = urlObj.pathname;

    if (!pathname.startsWith('/embed')) {
      pathname = `/embed${pathname}`;
    }

    const cleanPath = pathname.replace('/embed/embed', '/embed');
    
    // حفظ دقیق پروتکل و دامنه اصلی ورودی + تزریق پارامتر سایز بزرگ
    return `${urlObj.protocol}//${urlObj.hostname}${cleanPath}?utm_source=generator&theme=0`;
  };

  const handleLoadPlaylist = () => {
    if (!playlistInput.trim()) {
      setError('Please enter a Spotify URL');
      return;
    }

    try {
      let cleaned = playlistInput.trim();
      
      // بررسی ساده بر اساس ساختار ورودی خودت
      if (!cleaned.includes('spotify.com')) {
        setError('Must be a valid Spotify link');
        return;
      }

      const finalEmbedUrl = formatSpotifyEmbedUrl(cleaned);
      setPlaylistUrl(finalEmbedUrl);
      setPlaylistInput('');
      setError('');
    } catch (err) {
      setError('Invalid URL format');
    }
  };

  const loadDefaultPlaylist = (rawUrl: string) => {
    try {
      const formatted = formatSpotifyEmbedUrl(rawUrl);
      setPlaylistUrl(formatted);
      setError('');
    } catch (e) {
      setPlaylistUrl(rawUrl);
    }
  };

  // بازگرداندن دقیق دامنه‌ها به همان ساختاری که خودت تعریف کرده بودی
  const defaultPlaylists = [
    { name: 'Lofi Beats', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb9Cj9P7s?theme=0' },
    { name: 'Deep Focus', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKFB6uYW6g?theme=0' },
    { name: 'Chill Vibes', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYsnTv9g73?theme=0' },
    { name: 'Ambient Sleep', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWYcDQ8h9u7aa?theme=0' },
  ];

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
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left panel: player */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div className="flex-1 rounded-2xl overflow-hidden bg-black/10 dark:bg-white/5 backdrop-blur-sm relative min-h-[220px]">
              <iframe
                src={playlistUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Ambient Player"
                className="w-full h-full rounded-2xl opacity-85 hover:opacity-100 transition-opacity duration-300"
                style={{ minHeight: '100%' }}
              ></iframe>
            </div>

            {/* Note about playback */}
            <div className={`mt-3 p-2.5 rounded-xl flex gap-2 items-start text-xs leading-relaxed ${
              isDark ? 'bg-white/5' : 'bg-black/5'
            }`}>
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-400" />
              <p className="opacity-75">
                Note: Standard iframe browser security requires logging into your Spotify account in this browser window to play full songs instead of previews.
              </p>
            </div>
          </div>

          {/* Right panel */}
          <div className={`w-full md:w-64 border-t md:border-t-0 md:border-l border-white/10 dark:border-black/5 p-5 flex flex-col justify-between ${
            isDark ? 'bg-black/10' : 'bg-white/10'
          }`}>
            <div>
              <h4 className="font-sora font-medium text-xs uppercase tracking-wider mb-3 opacity-80">
                Preset Channels
              </h4>
              <div className="space-y-1.5 max-h-[140px] md:max-h-none overflow-y-auto custom-scrollbar">
                {defaultPlaylists.map((pl) => {
                  const isActive = playlistUrl.includes(pl.url.split('?')[0]);
                  return (
                    <button
                      key={pl.name}
                      onClick={() => loadDefaultPlaylist(pl.url)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-white/15 dark:bg-black/20 font-semibold'
                          : 'hover:bg-white/5 dark:hover:bg-black/5'
                      }`}
                      style={isActive ? { borderLeft: `3px solid ${accentColor}` } : {}}
                    >
                      <span>{pl.name}</span>
                      <ChevronRight size={12} className="opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 dark:border-black/5">
              <h4 className="font-sora font-medium text-xs uppercase tracking-wider mb-2 opacity-80">
                Custom Playlist URL
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Paste Spotify Link..."
                  value={playlistInput}
                  onChange={(e) => setPlaylistInput(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs outline-none border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white focus:border-white/30'
                      : 'bg-black/5 border-black/10 text-gray-900 focus:border-black/20'
                  }`}
                />
                {error && <p className="text-[10px] text-red-400 font-medium">{error}</p>}
                <button
                  onClick={handleLoadPlaylist}
                  className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: accentColor, color: isDark ? '#12072B' : '#FFFFFF' }}
                >
                  <RefreshCw size={12} />
                  <span>Load Channel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
