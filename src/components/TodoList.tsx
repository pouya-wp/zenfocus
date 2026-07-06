import React, { useState, useEffect } from 'react';
import { TodoItem } from '../types';
import { Check, Trash2, Plus, Flag, Folder, Clock, CheckSquare, Square, Flame } from 'lucide-react';

interface TodoListProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  isDark: boolean;
  todos: TodoItem[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

export default function TodoList({ isOpen, onClose, accentColor, isDark, todos, setTodos }: TodoListProps) {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState<TodoItem['priority']>(() => {
    return (localStorage.getItem('zenclock_todo_priority') as TodoItem['priority']) || 'medium';
  });
  const [category, setCategory] = useState(() => {
    return localStorage.getItem('zenclock_todo_category') || 'Focus';
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>(() => {
    return (localStorage.getItem('zenclock_todo_selectedFilter') as 'all' | 'active' | 'completed') || 'all';
  });
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(() => {
    return localStorage.getItem('zenclock_todo_selectedCategoryFilter') || 'all';
  });

  const categories = ['Focus', 'Work', 'Personal', 'Ideas'];

  useEffect(() => {
    localStorage.setItem('zenclock_todo_priority', priority);
  }, [priority]);

  useEffect(() => {
    localStorage.setItem('zenclock_todo_category', category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('zenclock_todo_selectedFilter', selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    localStorage.setItem('zenclock_todo_selectedCategoryFilter', selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTodo: TodoItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: taskText.trim(),
      completed: false,
      priority,
      category,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setTaskText('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const handleDeleteTodo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesStatus =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && !todo.completed) ||
      (selectedFilter === 'completed' && todo.completed);

    const matchesCategory =
      selectedCategoryFilter === 'all' || todo.category === selectedCategoryFilter;

    return matchesStatus && matchesCategory;
  });

  const getPriorityColor = (p: TodoItem['priority']) => {
    switch (p) {
      case 'high':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div
      style={{ display: isOpen ? 'flex' : 'none' }}
      className={`fixed inset-0 z-50 items-center justify-center pointer-events-none p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div
        className={`w-full max-w-xl rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col h-[560px] transition-all duration-500 ${
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
              <CheckSquare size={20} />
            </div>
            <div>
              <h3 className="font-sora font-semibold text-lg tracking-tight">Focus Quest</h3>
              <p className="text-xs opacity-60 font-mono">
                {todos.filter((t) => !t.completed).length} items remaining
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors cursor-pointer"
          >
            <Trash2 size={18} className="opacity-0" /> {/* Spacer */}
            <span className="font-sora font-medium text-xs opacity-75 mr-2">Minimize</span>
          </button>
        </div>

        {/* Filters Panel */}
        <div className="px-6 py-3 flex flex-wrap gap-2 items-center justify-between border-b border-white/5 dark:border-black/5">
          {/* Status filter tabs */}
          <div className="flex gap-1 bg-black/15 dark:bg-black/30 p-1 rounded-xl">
            {(['all', 'active', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize font-medium transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-white/10 text-white shadow-sm font-semibold'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={selectedFilter === filter ? { color: accentColor } : {}}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Category drop/filter chips */}
          <div className="flex gap-1 overflow-x-auto max-w-[240px] custom-scrollbar py-1">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                selectedCategoryFilter === 'all'
                  ? 'bg-white/10 border-white/25 text-white font-semibold'
                  : 'opacity-40 hover:opacity-80'
              }`}
            >
              #all
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-white/10 text-white font-semibold'
                    : 'opacity-40 hover:opacity-80'
                }`}
                style={selectedCategoryFilter === cat ? { color: accentColor } : {}}
              >
                #{cat.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Task List container */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-2.5">
          {filteredTodos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10 space-y-2">
              <CheckSquare size={48} className="stroke-[1.2]" />
              <p className="font-sora text-sm">No tasks meet your focus criteria</p>
              <p className="text-xs">Create a new milestone below to get flowing</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => handleToggleTodo(todo.id)}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer group transition-all duration-300 ${
                  todo.completed
                    ? 'bg-black/10 opacity-50 dark:bg-white/5 line-through'
                    : 'bg-white/5 hover:bg-white/10 dark:bg-black/10 border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button className="focus:outline-none shrink-0">
                    {todo.completed ? (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Check size={12} className={isDark ? 'text-black' : 'text-white'} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 dark:border-white/25 hover:border-white/60 transition-colors" />
                    )}
                  </button>

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium leading-snug truncate">{todo.text}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider opacity-50">
                        #{todo.category}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteTodo(todo.id, e)}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Dock Form */}
        <form
          onSubmit={handleAddTask}
          className="p-6 border-t border-white/10 dark:border-black/5 bg-white/5 dark:bg-black/15 flex flex-col gap-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="What is your next focus milestone?..."
              className={`flex-1 px-4 py-3 rounded-2xl text-sm outline-none border transition-all ${
                isDark
                  ? 'bg-black/20 border-white/10 text-white focus:border-white/30'
                  : 'bg-white/50 border-black/10 text-gray-900 focus:border-black/20'
              }`}
            />
            <button
              type="submit"
              className="p-3 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              style={{ backgroundColor: accentColor, color: isDark ? '#12072B' : '#FFFFFF' }}
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs opacity-80">
            {/* Category Select */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] opacity-60">Category:</span>
              <div className="flex gap-1">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                      category === cat ? 'bg-white/15 font-semibold' : 'opacity-50 hover:opacity-80'
                    }`}
                    style={category === cat ? { color: accentColor } : {}}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] opacity-60">Priority:</span>
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-2 py-1 rounded-lg text-[10px] capitalize font-medium transition-all cursor-pointer ${
                      priority === p ? 'bg-white/15 font-semibold' : 'opacity-50 hover:opacity-80'
                    }`}
                    style={
                      priority === p
                        ? {
                            color:
                              p === 'high' ? '#f43f5e' : p === 'medium' ? '#fbbf24' : '#10b981',
                          }
                        : {}
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
