export interface ThemePreset {
  id: string;
  name: string;
  type: 'gradient' | 'image' | 'solid';
  value: string; // CSS background gradient, solid color, or image URL
  glowColor: string; // CSS rgb/rgba or hex for text-shadow
  textColor: string; // text color for clock
  accentColor: string; // primary button/accent color
  secondaryColor: string; // sub-elements text/color
  isDark: boolean;
}

export interface ClockStyle {
  fontFamily: string; // key of fonts
  fontSize: number; // in pixels or custom units (e.g., 64 to 200)
  color: string;
  glowStrength: number; // 0 to 4
  fontWeight: '300' | '400' | '500' | '700' | '800';
  italic: boolean;
  format12h: boolean;
  showSeconds: boolean;
  showDate: boolean;
  showDayOfWeek: boolean;
  showAMPM: boolean;
  uppercaseDate: boolean;
  positionX: number; // percentage from left, or layout preset
  positionY: number; // percentage from top, or layout preset
  layoutType: 'absolute' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface CustomExpression {
  id: string;
  text: string;
  x: number; // percentage left
  y: number; // percentage top
  fontSize: number; // rem size
  fontFamily: string;
  color: string;
  opacity: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: number;
}
