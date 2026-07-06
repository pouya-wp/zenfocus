import React, { useState, useEffect } from 'react';
import { ThemePreset, ClockStyle, CustomExpression, TodoItem, Note } from './types';
import { THEME_PRESETS } from './presets';
import ClockView from './components/ClockView';
import SpotifyPlayer from './components/SpotifyPlayer';
import TodoList from './components/TodoList';
import Notepad from './components/Notepad';
import CustomizePanel from './components/CustomizePanel';
import {
  Music,
  CheckSquare,
  Edit3,
  Sliders,
  Settings,
  Sparkles,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Coffee,
  Heart,
  ExternalLink,
  ChevronRight,
  User,
  Activity,
  Compass
} from 'lucide-react';

export default function App() {
  // --- STATE MANAGERS ---
  
  // Theme & Wallpaper State
  const [themePreset, setThemePreset] = useState<ThemePreset>(() => {
    const cached = localStorage.getItem('zenclock_themePreset');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return THEME_PRESETS[0]; // Default Cosmic Twilight
  });

  const [customBgUrl, setCustomBgUrl] = useState<string>(() => {
    return localStorage.getItem('zenclock_customBgUrl') || '';
  });

  // Clock Configuration State
  const [clockStyle, setClockStyle] = useState<ClockStyle>(() => {
    const cached = localStorage.getItem('zenclock_clockStyle');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: 130,
      color: '#FFFFFF',
      glowStrength: 2,
      fontWeight: '700',
      italic: false,
      format12h: false,
      showSeconds: true,
      showDate: true,
      showDayOfWeek: true,
      showAMPM: true,
      uppercaseDate: true,
      positionX: 50,
      positionY: 48,
      layoutType: 'center',
    };
  });

  // Floating Expressions (Atmospheric texts)
  const [expressions, setExpressions] = useState<CustomExpression[]>(() => {
    const cached = localStorage.getItem('zenclock_expressions');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'default-1',
        text: 'breathe in, breathe out...',
        x: 50,
        y: 72,
        fontSize: 1.4,
        fontFamily: 'space',
        color: '#beb4ca',
        opacity: 0.65,
      },
      {
        id: 'default-2',
        text: 'Stay in the present flow.',
        x: 50,
        y: 22,
        fontSize: 1.1,
        fontFamily: 'sans',
        color: '#cfbdff',
        opacity: 0.5,
      }
    ];
  });

  // Persistent Module Overlay States
  const [activePanel, setActivePanel] = useState<null | 'spotify' | 'todo' | 'notes' | 'customize'>(null);

  // Focus Todos State (Persistent via LocalStorage)
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const cached = localStorage.getItem('zenclock_todos');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: '1', text: 'Plan tomorrow\'s deep focus targets', completed: false, priority: 'high', category: 'Focus', createdAt: Date.now() },
      { id: '2', text: 'Sip hot green tea and clear workspace', completed: true, priority: 'low', category: 'Personal', createdAt: Date.now() - 10000 },
      { id: '3', text: 'Review material design 3 tokens', completed: false, priority: 'medium', category: 'Work', createdAt: Date.now() - 5000 },
    ];
  });

  // Mind Dump Notes State (Persistent via LocalStorage)
  const [notes, setNotes] = useState<Note[]>(() => {
    const cached = localStorage.getItem('zenclock_notes');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'note-1',
        title: 'Zen Workspace Affirmation',
        content: `Welcome to your personal aesthetic sanctuary.

This space is optimized for focused thinking, screen-saving tranquility, and deep flow states.

Features:
- Custom background: Preset gradients or paste any Unsplash hotlink.
- Custom fonts & position: Check the 'Style Workspace' panel!
- Spotify Audio stream: Stays active in the background even when closed.
- Floating Expressions: Place custom text overlays anywhere on screen.
- Auto screensaver: Fades user interface elements after 15s of idle time. Move mouse to restore.`,
        category: 'Focus',
        updatedAt: Date.now(),
      }
    ];
  });

  // Idle Screen Saver Dimmer Logic
  const [isIdle, setIsIdle] = useState(false);
  const [autoDimMinutes, setAutoDimMinutes] = useState<number>(() => {
    const cached = localStorage.getItem('zenclock_autoDimMinutes');
    if (cached) {
      const parsed = parseInt(cached, 10);
      return isNaN(parsed) ? 15 : parsed;
    }
    return 15; // 15 seconds for screensaver activation
  });
  const [showManualBlackout, setShowManualBlackout] = useState(false);

  // --- LOCAL PERSISTENCE BACKUPS ---
  useEffect(() => {
    localStorage.setItem('zenclock_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('zenclock_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('zenclock_themePreset', JSON.stringify(themePreset));
  }, [themePreset]);

  useEffect(() => {
    localStorage.setItem('zenclock_customBgUrl', customBgUrl);
  }, [customBgUrl]);

  useEffect(() => {
    localStorage.setItem('zenclock_clockStyle', JSON.stringify(clockStyle));
  }, [clockStyle]);

  useEffect(() => {
    localStorage.setItem('zenclock_expressions', JSON.stringify(expressions));
  }, [expressions]);

  useEffect(() => {
    localStorage.setItem('zenclock_autoDimMinutes', String(autoDimMinutes));
  }, [autoDimMinutes]);

  // --- AUTOMATIC IDLE SCREENSAVER SYSTEM ---
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      
      // If any modal/panel is open, we do not auto-dim to let user finish typing!
      if (!activePanel) {
        idleTimer = setTimeout(() => {
          setIsIdle(true);
        }, autoDimMinutes * 1000); // converting seconds
      }
    };

    // Listen to user interactions
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    // Initial trigger
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [activePanel, autoDimMinutes]);

  // --- HANDLERS ---
  const handleTogglePanel = (panel: 'spotify' | 'todo' | 'notes' | 'customize') => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
    }
  };

  // Greeting computed dynamically
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Late Night Flow';
    if (hour < 12) return 'Morning Mindset';
    if (hour < 17) return 'Afternoon Momentum';
    return 'Evening Sanctuary';
  };

  // Build backdrop wrapper styling
  const getBackdropStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
    };

    if (themePreset.type === 'image') {
      return {
        ...baseStyle,
        backgroundImage: `url(${themePreset.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    } else if (themePreset.type === 'gradient') {
      return {
        ...baseStyle,
        background: themePreset.value,
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: themePreset.value,
      };
    }
  };

  return (
    <div
      style={getBackdropStyle()}
      className={`relative w-full h-screen overflow-hidden font-sans select-none transition-all duration-1000 ${
        themePreset.isDark ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Absolute Ambient Background Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 mix-blend-multiply z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-0" />

      {/* Manual Full Blackout Screen Saver Mode */}
      {showManualBlackout && (
        <div
          onClick={() => setShowManualBlackout(false)}
          className="absolute inset-0 bg-black z-50 cursor-pointer flex flex-col items-center justify-center animate-pulse"
        >
          <div className="text-center space-y-3 pointer-events-none">
            <Moon size={48} className="mx-auto text-violet-400 opacity-60 animate-bounce" />
            <p className="font-mono text-xs text-white/50 tracking-widest uppercase">Deep Focus Blackout</p>
            <p className="text-[10px] text-white/30 font-mono">Click anywhere to restore dashboard</p>
          </div>
        </div>
      )}

      {/* --- FLOATING SCREENSAVER CANVAS --- */}
      <div className="absolute inset-0 z-10">
        <ClockView
          clockStyle={clockStyle}
          expressions={expressions}
          themePreset={themePreset}
          isIdle={isIdle}
        />
      </div>

      {/* --- TOP BRAND / ACTION BAR --- */}
      <header
        className={`fixed top-0 inset-x-0 z-30 flex items-center justify-between px-10 py-6 transition-all duration-700 ${
          isIdle ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Brand Logo & Dynamic Greeting */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${themePreset.accentColor}25`, border: `1px solid ${themePreset.accentColor}30` }}
            >
              <Sparkles size={14} style={{ color: themePreset.accentColor }} />
            </div>
            <span className="font-sora font-semibold text-base tracking-tight select-none">
              ZenFocus
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 dark:bg-black/20 border border-white/5 text-xs font-mono select-none">
            <Coffee size={12} className="opacity-60" />
            <span className="opacity-75">{getGreeting()}</span>
          </div>
        </div>
      </header>


      {/* --- MOUNTED PERSISTENT DIALOGS & POPUPS --- */}
      {/* 
        All panels are always mounted but toggled with hidden styles to comply strictly 
        with the directive of keeping the Spotify playback alive & preserving notepad / todo states.
      */}
      <div className="relative z-40">
        {/* Spotify Audio Embed Popup */}
        <SpotifyPlayer
          isOpen={activePanel === 'spotify'}
          onClose={() => setActivePanel(null)}
          accentColor={themePreset.accentColor}
          isDark={themePreset.isDark}
        />

        {/* Todo List Focus Milestones Popup */}
        <TodoList
          isOpen={activePanel === 'todo'}
          onClose={() => setActivePanel(null)}
          accentColor={themePreset.accentColor}
          isDark={themePreset.isDark}
          todos={todos}
          setTodos={setTodos}
        />

        {/* Notepad Text Streams Popup */}
        <Notepad
          isOpen={activePanel === 'notes'}
          onClose={() => setActivePanel(null)}
          accentColor={themePreset.accentColor}
          isDark={themePreset.isDark}
          notes={notes}
          setNotes={setNotes}
        />

        {/* Style Sandbox Customizer Panel */}
        <CustomizePanel
          isOpen={activePanel === 'customize'}
          onClose={() => setActivePanel(null)}
          isDark={themePreset.isDark}
          accentColor={themePreset.accentColor}
          themePreset={themePreset}
          setThemePreset={setThemePreset}
          customBgUrl={customBgUrl}
          setCustomBgUrl={setCustomBgUrl}
          clockStyle={clockStyle}
          setClockStyle={setClockStyle}
          expressions={expressions}
          setExpressions={setExpressions}
        />
      </div>

      {/* --- BOTTOM MATERIAL DESIGN 3 EXPRESSIVE UTILITY DOCK --- */}
      <nav
        className={`fixed bottom-0 inset-x-0 z-30 flex justify-center pb-10 transition-all duration-700 ${
          isIdle ? 'opacity-0 translate-y-[30px] pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div
          className={`flex items-center gap-3 px-6 py-3.5 rounded-[2.5rem] shadow-2xl transition-all duration-300 border ${
            themePreset.isDark
              ? 'bg-black/40 backdrop-blur-3xl border-white/10 text-white'
              : 'bg-white/70 backdrop-blur-3xl border-black/10 text-gray-800'
          }`}
        >
          {/* Spotify Player Trigger */}
          <button
            onClick={() => handleTogglePanel('spotify')}
            className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group relative ${
              activePanel === 'spotify'
                ? 'bg-emerald-500/15 text-emerald-400 font-semibold shadow-md border border-emerald-500/20'
                : 'hover:bg-white/10 dark:hover:bg-black/10 opacity-75 hover:opacity-100'
            }`}
          >
            <Music size={22} className="group-active:scale-110 duration-200" />
            <span className="absolute -top-12 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono border border-white/10 text-white shadow-lg pointer-events-none whitespace-nowrap">
              Spotify Audio
            </span>
          </button>

          {/* Todo List Trigger */}
          <button
            onClick={() => handleTogglePanel('todo')}
            className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group relative ${
              activePanel === 'todo'
                ? 'bg-indigo-500/15 text-indigo-400 font-semibold shadow-md border border-indigo-500/20'
                : 'hover:bg-white/10 dark:hover:bg-black/10 opacity-75 hover:opacity-100'
            }`}
          >
            <CheckSquare size={22} className="group-active:scale-110 duration-200" />
            <span className="absolute -top-12 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono border border-white/10 text-white shadow-lg pointer-events-none whitespace-nowrap">
              Tasks Focus
            </span>
          </button>

          {/* Divider line */}
          <div className="w-[1px] h-10 bg-white/10 dark:bg-black/10 mx-1 shrink-0" />

          {/* Notepad Trigger */}
          <button
            onClick={() => handleTogglePanel('notes')}
            className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group relative ${
              activePanel === 'notes'
                ? 'bg-amber-500/15 text-amber-400 font-semibold shadow-md border border-amber-500/20'
                : 'hover:bg-white/10 dark:hover:bg-black/10 opacity-75 hover:opacity-100'
            }`}
          >
            <Edit3 size={22} className="group-active:scale-110 duration-200" />
            <span className="absolute -top-12 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono border border-white/10 text-white shadow-lg pointer-events-none whitespace-nowrap">
              Mind Notepad
            </span>
          </button>

          {/* Customize Panel Trigger */}
          <button
            onClick={() => handleTogglePanel('customize')}
            className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group relative ${
              activePanel === 'customize'
                ? 'bg-violet-500/15 text-violet-400 font-semibold shadow-md border border-violet-500/20'
                : 'hover:bg-white/10 dark:hover:bg-black/10 opacity-75 hover:opacity-100'
            }`}
          >
            <Sliders size={22} className="group-active:scale-110 duration-200" />
            <span className="absolute -top-12 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono border border-white/10 text-white shadow-lg pointer-events-none whitespace-nowrap">
              Workspace Style
            </span>
          </button>
        </div>
      </nav>

      {/* Aesthetic Bottom Info Indicator (fades with screensaver) */}
      <footer
        className={`fixed bottom-6 left-10 z-20 hidden lg:flex items-center gap-2 text-[11px] font-mono tracking-widest text-white/45 uppercase select-none transition-all duration-700 ${
          isIdle ? 'opacity-0 translate-y-[20px] pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
      </footer>
    </div>
  );
}
