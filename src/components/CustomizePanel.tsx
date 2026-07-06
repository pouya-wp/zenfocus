import React, { useState } from 'react';
import { ThemePreset, ClockStyle, CustomExpression } from '../types';
import { THEME_PRESETS, FONTS_LIST } from '../presets';
import { Palette, Type, Clock, Sliders, Type as FontIcon, Plus, Trash2, Eye, Layout, Settings2, Info } from 'lucide-react';

interface CustomizePanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  accentColor: string;
  themePreset: ThemePreset;
  setThemePreset: (t: ThemePreset) => void;
  customBgUrl: string;
  setCustomBgUrl: (url: string) => void;
  clockStyle: ClockStyle;
  setClockStyle: React.Dispatch<React.SetStateAction<ClockStyle>>;
  expressions: CustomExpression[];
  setExpressions: React.Dispatch<React.SetStateAction<CustomExpression[]>>;
}

type TabType = 'bg' | 'clock' | 'expression' | 'visibility';

export default function CustomizePanel({
  isOpen,
  onClose,
  isDark,
  accentColor,
  themePreset,
  setThemePreset,
  customBgUrl,
  setCustomBgUrl,
  clockStyle,
  setClockStyle,
  expressions,
  setExpressions,
}: CustomizePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('bg');
  
  // Expression adding local states
  const [exprText, setExprText] = useState('');
  const [exprX, setExprX] = useState(50);
  const [exprY, setExprY] = useState(70);
  const [exprSize, setExprSize] = useState(1.5);
  const [exprFont, setExprFont] = useState('space');
  const [exprColor, setExprColor] = useState('#ffffff');
  const [exprOpacity, setExprOpacity] = useState(0.8);

  const handleSelectPreset = (preset: ThemePreset) => {
    setThemePreset(preset);
    // Reset custom URL if selecting a non-image preset or a preset image
    if (preset.type !== 'image') {
      setCustomBgUrl('');
    }
  };

  const handleCustomBgSubmit = (url: string) => {
    setCustomBgUrl(url);
    // Create temporary preset for custom image
    setThemePreset({
      id: 'custom-user-bg',
      name: 'Custom Wallpaper',
      type: 'image',
      value: url,
      glowColor: 'rgba(255, 255, 255, 0.45)',
      textColor: '#FFFFFF',
      accentColor: '#FFFFFF',
      secondaryColor: '#D1D5DB',
      isDark: true,
    });
  };

  const updateClockStyle = <K extends keyof ClockStyle>(key: K, value: ClockStyle[K]) => {
    setClockStyle((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddExpression = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exprText.trim()) return;

    const newExpr: CustomExpression = {
      id: Math.random().toString(36).substring(2, 9),
      text: exprText.trim(),
      x: exprX,
      y: exprY,
      fontSize: exprSize,
      fontFamily: exprFont,
      color: exprColor,
      opacity: exprOpacity,
    };

    setExpressions((prev) => [...prev, newExpr]);
    setExprText('');
  };

  const handleDeleteExpression = (id: string) => {
    setExpressions((prev) => prev.filter((ex) => ex.id !== id));
  };

  return (
    <div
      style={{ display: isOpen ? 'flex' : 'none' }}
      className={`fixed inset-0 z-50 items-center justify-center pointer-events-none p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div
        className={`w-full max-w-3xl rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col h-[620px] transition-all duration-500 ${
          isDark ? 'glass-panel text-gray-100' : 'glass-panel-light text-gray-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 dark:border-black/5 bg-white/5 dark:bg-black/5">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl flex items-center justify-center animate-spin-slow"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              <Settings2 size={20} />
            </div>
            <div>
              <h3 className="font-sora font-semibold text-lg tracking-tight">Style Sandbox</h3>
              <p className="text-xs opacity-60 font-mono">Personalize your clock screensaver environment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors cursor-pointer"
          >
            <span className="font-sora font-medium text-xs opacity-75 mr-2">Minimize</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 dark:border-black/5 px-6 py-2 gap-1 overflow-x-auto custom-scrollbar">
          {[
            { id: 'bg', label: 'Atmosphere & Wallpaper', icon: Palette },
            { id: 'clock', label: 'Clock Typography', icon: FontIcon },
            { id: 'visibility', label: 'Formatting & Layout', icon: Layout },
            { id: 'expression', label: 'Writing Expressions', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'opacity-55 hover:opacity-90 hover:bg-white/5'
                }`}
                style={isActive ? { color: accentColor } : {}}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {/* TAB 1: BACKGROUND & ATMOSPHERE */}
          {activeTab === 'bg' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-sora font-medium text-sm mb-3">Predefined Wallpapers & Gradients</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {THEME_PRESETS.map((p) => {
                    const isSelected = themePreset.id === p.id && !customBgUrl;
                    const style: React.CSSProperties =
                      p.type === 'gradient'
                        ? { background: p.value }
                        : p.type === 'solid'
                        ? { backgroundColor: p.value }
                        : { backgroundImage: `url(${p.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };

                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPreset(p)}
                        className={`aspect-[1.5] rounded-2xl relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                          isSelected ? 'ring-4' : 'hover:scale-[1.03]'
                        }`}
                        style={{ ...style, ringColor: accentColor }}
                      >
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                          <span className="text-[11px] font-medium text-white font-mono">{p.name}</span>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px] text-white font-mono uppercase">
                          {p.type}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 dark:bg-black/10 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Palette size={16} />
                  <h4>Custom Wallpaper Hotlinking (Flocus style)</h4>
                </div>
                <p className="text-xs opacity-65 leading-relaxed">
                  Hotlink any online high-res wallpaper image (Unsplash, Pinterest, raw file host) to define your custom backdrop.
                </p>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder="Paste Image URL (e.g. https://images.unsplash.com/...)"
                    defaultValue={customBgUrl}
                    onBlur={(e) => handleCustomBgSubmit(e.target.value)}
                    className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                      isDark
                        ? 'bg-black/30 border-white/10 text-white focus:border-white/20'
                        : 'bg-white border-black/10 text-gray-900 focus:border-black/20'
                    }`}
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement);
                      handleCustomBgSubmit(input.value);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                    style={{ backgroundColor: accentColor, color: isDark ? '#12072B' : '#FFFFFF' }}
                  >
                    Apply Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLOCK TYPOGRAPHY */}
          {activeTab === 'clock' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Settings */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-mono opacity-60 block mb-2 uppercase tracking-wider">
                    Font Family
                  </label>
                  <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                    {FONTS_LIST.map((f) => {
                      const isSelected = clockStyle.fontFamily === f.family;
                      return (
                        <button
                          key={f.id}
                          onClick={() => updateClockStyle('fontFamily', f.family)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-white/15 text-white font-semibold'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <span style={{ fontFamily: f.family }}>{f.name}</span>
                          {isSelected && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: accentColor }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono opacity-60 mb-2 uppercase tracking-wider">
                    <span>Font Size</span>
                    <span>{clockStyle.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="220"
                    value={clockStyle.fontSize}
                    onChange={(e) => updateClockStyle('fontSize', parseInt(e.target.value))}
                    className="w-full accent-primary h-1 bg-white/10 rounded-lg cursor-pointer"
                    style={{ accentColor }}
                  />
                </div>
              </div>

              {/* Right Settings */}
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono opacity-60 block mb-2 uppercase tracking-wider">
                      Font Weight
                    </label>
                    <select
                      value={clockStyle.fontWeight}
                      onChange={(e) => updateClockStyle('fontWeight', e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-xl text-xs outline-none border transition-all ${
                        isDark ? 'bg-black/25 border-white/10 text-white' : 'bg-white border-black/10'
                      }`}
                    >
                      <option value="300">Light (300)</option>
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Ultra Bold (800)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono opacity-60 block mb-2 uppercase tracking-wider">
                      Font Style
                    </label>
                    <button
                      onClick={() => updateClockStyle('italic', !clockStyle.italic)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        clockStyle.italic
                          ? 'bg-white/10 border-white/30 text-white font-semibold'
                          : 'opacity-55 border-transparent hover:opacity-85'
                      }`}
                      style={clockStyle.italic ? { color: accentColor, borderColor: accentColor } : {}}
                    >
                      Italic Text
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono opacity-60 mb-2 uppercase tracking-wider">
                    <span>Clock Base Color</span>
                  </div>
                  <div className="flex gap-2">
                    {['#FFFFFF', '#FFE7D1', '#D4FFF3', '#F2D4FF', '#FFD4E5', '#E1FFD4', '#EBF5FF'].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateClockStyle('color', color)}
                        className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                          clockStyle.color === color ? 'border-white scale-110 shadow-md' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={clockStyle.color}
                      onChange={(e) => updateClockStyle('color', e.target.value)}
                      className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none p-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono opacity-60 mb-2 uppercase tracking-wider">
                    <span>Neon Glow Strength</span>
                    <span>{clockStyle.glowStrength} / 4</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={clockStyle.glowStrength}
                    onChange={(e) => updateClockStyle('glowStrength', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg cursor-pointer"
                    style={{ accentColor }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISIBILITY & LAYOUT */}
          {activeTab === 'visibility' && (
            <div className="space-y-6">
              {/* Layout Alignment Preset */}
              <div>
                <label className="text-xs font-mono opacity-60 block mb-3 uppercase tracking-wider">
                  Preset Viewport Alignment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'center', label: 'Centered Screen' },
                    { id: 'top-left', label: 'Top-Left Corner' },
                    { id: 'top-right', label: 'Top-Right Corner' },
                    { id: 'bottom-left', label: 'Bottom-Left Corner' },
                    { id: 'bottom-right', label: 'Bottom-Right Corner' },
                    { id: 'absolute', label: 'Custom Manual Slider' },
                  ].map((align) => {
                    const isSelected = clockStyle.layoutType === align.id;
                    return (
                      <button
                        key={align.id}
                        onClick={() => updateClockStyle('layoutType', align.id as any)}
                        className={`p-3.5 rounded-2xl border text-xs font-medium text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/15 text-white font-semibold'
                            : 'opacity-55 border-transparent hover:opacity-90'
                        }`}
                        style={isSelected ? { color: accentColor, borderColor: accentColor } : {}}
                      >
                        {align.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider for Absolute Offset (Custom Position) */}
              {clockStyle.layoutType === 'absolute' && (
                <div className="p-5 rounded-2xl bg-white/5 dark:bg-black/10 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono opacity-60 mb-2">
                      <span>Horizontal Position (X Offset)</span>
                      <span>{clockStyle.positionX}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={clockStyle.positionX}
                      onChange={(e) => updateClockStyle('positionX', parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg cursor-pointer"
                      style={{ accentColor }}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono opacity-60 mb-2">
                      <span>Vertical Position (Y Offset)</span>
                      <span>{clockStyle.positionY}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={clockStyle.positionY}
                      onChange={(e) => updateClockStyle('positionY', parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg cursor-pointer"
                      style={{ accentColor }}
                    />
                  </div>
                </div>
              )}

              {/* Specific formatting elements toggles */}
              <div>
                <label className="text-xs font-mono opacity-60 block mb-3 uppercase tracking-wider">
                  Display Elements
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'format12h', label: '12-Hour System' },
                    { key: 'showSeconds', label: 'Show Live Seconds' },
                    { key: 'showDate', label: 'Show Current Date' },
                    { key: 'showDayOfWeek', label: 'Show Day of Week' },
                    { key: 'showAMPM', label: 'Show AM / PM Tag' },
                    { key: 'uppercaseDate', label: 'Uppercase Date String' },
                  ].map((elem) => {
                    const value = clockStyle[elem.key as keyof ClockStyle] as boolean;
                    return (
                      <button
                        key={elem.key}
                        onClick={() => updateClockStyle(elem.key as any, !value)}
                        className={`px-4 py-3 rounded-2xl border text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                          value ? 'bg-white/10 text-white' : 'opacity-40 border-transparent hover:opacity-75'
                        }`}
                        style={value ? { color: accentColor, borderColor: accentColor } : {}}
                      >
                        <span>{elem.label}</span>
                        <span className="text-[10px] font-mono">{value ? 'ON' : 'OFF'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WRITING EXPRESSIONS */}
          {activeTab === 'expression' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 dark:bg-black/10 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-primary" style={{ color: accentColor }} />
                  <h4 className="font-sora font-semibold text-xs uppercase tracking-wider">What are expressions?</h4>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">
                  Expressions are floating text overlays placed in exact coordinates on your screensaver page. They could be inspirational quotes, focus intentions (e.g. "Take a deep breath"), or current dynamic thoughts. Set the position, font, and scale, and let them float in the background.
                </p>
              </div>

              <form onSubmit={handleAddExpression} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono opacity-60 block mb-1.5 uppercase">Expression Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Breathe in, breathe out..."
                      value={exprText}
                      onChange={(e) => setExprText(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                        isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-black/10'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono opacity-60 block mb-1">X Coord ({exprX}%)</label>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={exprX}
                        onChange={(e) => setExprX(parseInt(e.target.value))}
                        className="w-full accent-primary h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono opacity-60 block mb-1">Y Coord ({exprY}%)</label>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={exprY}
                        onChange={(e) => setExprY(parseInt(e.target.value))}
                        className="w-full accent-primary h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono opacity-60 block mb-1">Font Family</label>
                      <select
                        value={exprFont}
                        onChange={(e) => setExprFont(e.target.value)}
                        className={`w-full px-2.5 py-2 rounded-xl text-xs outline-none border transition-all ${
                          isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-black/10'
                        }`}
                      >
                        {FONTS_LIST.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name.split(' ')[0]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono opacity-60 block mb-1">Font Size ({exprSize}rem)</label>
                      <input
                        type="range"
                        min="0.8"
                        max="3.5"
                        step="0.1"
                        value={exprSize}
                        onChange={(e) => setExprSize(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono opacity-60 block mb-1">Opacity ({exprOpacity})</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={exprOpacity}
                        onChange={(e) => setExprOpacity(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: accentColor, color: isDark ? '#12072B' : '#FFFFFF' }}
                      >
                        <Plus size={12} />
                        <span>Float Text</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Floating elements list */}
              <div>
                <h4 className="font-sora font-medium text-xs uppercase tracking-wider mb-3 opacity-70">
                  Active Floating Expressions ({expressions.length})
                </h4>
                {expressions.length === 0 ? (
                  <p className="text-xs opacity-40 italic">No custom expressions are floating on the screen.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                    {expressions.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold truncate">"{ex.text}"</p>
                          <p className="text-[10px] opacity-50 font-mono">
                            Coords: ({ex.x}%, {ex.y}%) • Size: {ex.fontSize}rem • Opacity: {ex.opacity}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteExpression(ex.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
