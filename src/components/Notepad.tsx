import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Edit3, Plus, Trash2, Download, Search, FileText, ChevronRight, Check } from 'lucide-react';

interface NotepadProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  isDark: boolean;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function Notepad({ isOpen, onClose, accentColor, isDark, notes, setNotes }: NotepadProps) {
  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    return localStorage.getItem('zenclock_activeNoteId') || '';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSavedText, setIsSavedText] = useState('Saved Locally');

  // Set first note as active if none is selected or current active note is deleted
  useEffect(() => {
    if (notes.length > 0) {
      const exists = notes.some((n) => n.id === activeNoteId);
      if (!activeNoteId || !exists) {
        setActiveNoteId(notes[0].id);
      }
    }
  }, [notes, activeNoteId]);

  useEffect(() => {
    if (activeNoteId) {
      localStorage.setItem('zenclock_activeNoteId', activeNoteId);
    }
  }, [activeNoteId]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(2, 9),
      title: 'Untitled Flow Draft',
      content: '',
      category: 'General',
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    triggerSavedIndicator();
  };

  const handleUpdateContent = (content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, content, updatedAt: Date.now() } : n))
    );
    triggerSavedIndicator();
  };

  const handleUpdateTitle = (title: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, title, updatedAt: Date.now() } : n))
    );
    triggerSavedIndicator();
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : '');
    }
  };

  const triggerSavedIndicator = () => {
    setIsSavedText('Typing...');
    const timer = setTimeout(() => {
      setIsSavedText('Saved Just Now');
    }, 800);
    return () => clearTimeout(timer);
  };

  const handleExportNote = (note: Note) => {
    const element = document.createElement('a');
    const file = new Blob([note.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.toLowerCase().replace(/\s+/g, '-') || 'note'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Stats
  const wordCount = activeNote
    ? activeNote.content.trim().split(/\s+/).filter((w) => w.length > 0).length
    : 0;
  const charCount = activeNote ? activeNote.content.length : 0;

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{ display: isOpen ? 'flex' : 'none' }}
      className={`fixed inset-0 z-50 items-center justify-center pointer-events-none p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col h-[580px] transition-all duration-500 ${
          isDark ? 'glass-panel text-gray-100' : 'glass-panel-light text-gray-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 dark:border-black/5 bg-white/5 dark:bg-black/5">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              <Edit3 size={20} />
            </div>
            <div>
              <h3 className="font-sora font-semibold text-lg tracking-tight">Mind Dump Pad</h3>
              <p className="text-xs opacity-60 font-mono">Capture raw thoughts and plans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors cursor-pointer"
          >
            <span className="font-sora font-medium text-xs opacity-75 mr-2">Minimize</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Notes Sidebar */}
          <div className="w-72 border-r border-white/10 dark:border-black/5 flex flex-col justify-between bg-black/10 dark:bg-black/20">
            {/* Search and Add Note button */}
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-3.5 opacity-50" />
                <input
                  type="text"
                  placeholder="Search drafts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                    isDark
                      ? 'bg-black/20 border-white/10 text-white focus:border-white/30'
                      : 'bg-white/50 border-black/10 text-gray-900 focus:border-black/20'
                  }`}
                />
              </div>

              <button
                onClick={handleCreateNote}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: accentColor, color: isDark ? '#12072B' : '#FFFFFF' }}
              >
                <Plus size={14} />
                <span>New Mind Dump</span>
              </button>
            </div>

            {/* List of drafts */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {filteredNotes.map((note) => {
                const isActive = note.id === activeNoteId;
                const dateString = new Date(note.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between group ${
                      isActive ? 'bg-white/10 shadow-sm' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="min-w-0 flex-1 flex gap-2.5 items-start">
                      <FileText size={14} className="opacity-55 mt-1 shrink-0" style={isActive ? { color: accentColor } : {}} />
                      <div className="min-w-0">
                        <h4 className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'opacity-80'}`}>
                          {note.title || 'Untitled Note'}
                        </h4>
                        <span className="text-[10px] font-mono opacity-40">{dateString}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-1 rounded text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0 ml-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Editor Workspace */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-black/5 dark:bg-black/10">
            {activeNote ? (
              <div className="flex-1 flex flex-col p-6 h-full overflow-hidden">
                {/* Title Editor */}
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => handleUpdateTitle(e.target.value)}
                    placeholder="Give this flow a title..."
                    className="bg-transparent border-none text-xl font-sora font-semibold focus:ring-0 p-0 outline-none w-full mr-4"
                  />
                  <button
                    onClick={() => handleExportNote(activeNote)}
                    className={`p-2 rounded-xl transition-all hover:bg-white/10 flex items-center gap-1.5 text-xs font-mono border border-white/10 cursor-pointer shrink-0`}
                    title="Export Note to .txt"
                  >
                    <Download size={14} />
                    <span>TXT</span>
                  </button>
                </div>

                {/* Content Textarea */}
                <textarea
                  value={activeNote.content}
                  onChange={(e) => handleUpdateContent(e.target.value)}
                  placeholder="Unleash your stream of consciousness. Clear your head here..."
                  className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm leading-relaxed resize-none outline-none custom-scrollbar font-sans"
                />

                {/* Stats Footer */}
                <div className="mt-4 pt-4 border-t border-white/10 dark:border-black/5 flex items-center justify-between text-[11px] font-mono opacity-65">
                  <div className="flex gap-4">
                    <span>WORDS: {wordCount}</span>
                    <span>CHARS: {charCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check size={12} className="text-emerald-400" />
                    <span>{isSavedText}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-10 space-y-2">
                <FileText size={48} className="stroke-[1.2]" />
                <p className="font-sora text-sm">Clear your mind</p>
                <p className="text-xs">Create or select a mind dump note to start typing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
