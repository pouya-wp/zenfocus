import React, { useState, useEffect } from 'react';
import { ClockStyle, CustomExpression, ThemePreset } from '../types';
import { FONTS_LIST } from '../presets';

interface ClockViewProps {
  clockStyle: ClockStyle;
  expressions: CustomExpression[];
  themePreset: ThemePreset;
  isIdle: boolean;
}

export default function ClockView({ clockStyle, expressions, themePreset, isIdle }: ClockViewProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 250);
    return () => clearInterval(timer);
  }, []);

  // Format hours, minutes, seconds, am/pm
  const formatTime = () => {
    let hoursNum = time.getHours();
    const minutesNum = time.getMinutes();
    const secondsNum = time.getSeconds();

    let ampm = '';
    if (clockStyle.format12h) {
      ampm = hoursNum >= 12 ? 'PM' : 'AM';
      hoursNum = hoursNum % 12;
      hoursNum = hoursNum ? hoursNum : 12; // the hour '0' should be '12'
    }

    const hours = String(hoursNum).padStart(2, '0');
    const minutes = String(minutesNum).padStart(2, '0');
    const seconds = String(secondsNum).padStart(2, '0');

    return {
      hours,
      minutes,
      seconds,
      ampm: clockStyle.showAMPM && clockStyle.format12h ? ampm : '',
    };
  };

  // Format date string
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
    };
    if (clockStyle.showDayOfWeek) {
      options.weekday = 'long';
    }

    let dateStr = time.toLocaleDateString('en-US', options);
    // Replace commas if needed, or format
    if (clockStyle.uppercaseDate) {
      dateStr = dateStr.toUpperCase();
    }
    return dateStr;
  };

  const { hours, minutes, seconds, ampm } = formatTime();
  const dateStr = formatDate();

  // Find font family from presets
  const selectedFont = FONTS_LIST.find((f) => f.family === clockStyle.fontFamily || f.id === clockStyle.fontFamily);
  const fontFamilyValue = selectedFont ? selectedFont.family : clockStyle.fontFamily;

  // Custom text-shadow based on glow
  const textShadowStyle =
    clockStyle.glowStrength > 0
      ? `0 0 ${clockStyle.glowStrength * 10}px ${themePreset.glowColor}`
      : 'none';

  const clockStyles: React.CSSProperties = {
    fontFamily: fontFamilyValue,
    fontSize: `${clockStyle.fontSize}px`,
    fontWeight: clockStyle.fontWeight,
    fontStyle: clockStyle.italic ? 'italic' : 'normal',
    color: clockStyle.color || themePreset.textColor,
    textShadow: textShadowStyle,
    lineHeight: 1,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Determine container position classes
  const getContainerPositionStyle = (): React.CSSProperties => {
    switch (clockStyle.layoutType) {
      case 'center':
        return {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        };
      case 'top-left':
        return {
          position: 'absolute',
          left: '10%',
          top: '18%',
          transform: 'translate(0, 0)',
          textAlign: 'left',
        };
      case 'top-right':
        return {
          position: 'absolute',
          right: '10%',
          top: '18%',
          transform: 'translate(0, 0)',
          textAlign: 'right',
        };
      case 'bottom-left':
        return {
          position: 'absolute',
          left: '10%',
          bottom: '22%',
          transform: 'translate(0, 0)',
          textAlign: 'left',
        };
      case 'bottom-right':
        return {
          position: 'absolute',
          right: '10%',
          bottom: '22%',
          transform: 'translate(0, 0)',
          textAlign: 'right',
        };
      case 'absolute':
        return {
          position: 'absolute',
          left: `${clockStyle.positionX}%`,
          top: `${clockStyle.positionY}%`,
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        };
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* 1. Main Clock Frame */}
      <div style={getContainerPositionStyle()} className="pointer-events-auto transition-all duration-700">
        <div className="flex flex-col items-center justify-center md:flex-row md:items-baseline md:gap-2">
          {/* Main digits container */}
          <div className="flex items-center">
            <span style={clockStyles} className="clock-glow">
              {hours}:{minutes}
            </span>
            {clockStyle.showSeconds && (
              <span
                style={{
                  ...clockStyles,
                  fontSize: `${clockStyle.fontSize * 0.45}px`,
                  opacity: 0.75,
                  marginLeft: '8px',
                }}
                className="clock-glow font-mono"
              >
                :{seconds}
              </span>
            )}
          </div>

          {/* AM / PM designation */}
          {ampm && (
            <span
              className="text-xs font-mono uppercase tracking-[0.2em] opacity-70 mt-1 md:mt-0 md:ml-2"
              style={{ color: themePreset.secondaryColor }}
            >
              {ampm}
            </span>
          )}
        </div>

        {/* 2. Live Date Subtitle */}
        {clockStyle.showDate && (
          <p
            className="text-xs md:text-sm font-mono tracking-[0.3em] mt-3.5 opacity-80"
            style={{ color: themePreset.secondaryColor }}
          >
            {dateStr}
          </p>
        )}
      </div>

      {/* 3. Render Custom Expressions */}
      {expressions.map((ex) => {
        const fontObj = FONTS_LIST.find((f) => f.id === ex.fontFamily || f.family === ex.fontFamily);
        const exprFontFamily = fontObj ? fontObj.family : '"Space Grotesk", sans-serif';

        return (
          <div
            key={ex.id}
            style={{
              position: 'absolute',
              left: `${ex.x}%`,
              top: `${ex.y}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: exprFontFamily,
              fontSize: `${ex.fontSize}rem`,
              color: ex.color,
              opacity: isIdle ? Math.max(0.2, ex.opacity * 0.5) : ex.opacity,
              transition: 'opacity 1s ease-in-out, transform 0.5s ease-out',
            }}
            className="font-medium tracking-tight whitespace-nowrap drop-shadow-lg text-center animate-float pointer-events-auto cursor-default select-none"
          >
            {ex.text}
          </div>
        );
      })}
    </div>
  );
}
