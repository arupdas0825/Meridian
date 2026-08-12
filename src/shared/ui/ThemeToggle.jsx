'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeToggle } from '@/shared/lib/useThemeToggle';

export function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useThemeToggle();

  return (
    <div className={`flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-line ${className}`}>
      <button
        onClick={() => setTheme('light')}
        title="Light Mode"
        className={`p-1.5 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-surface-1 text-ink-900 shadow-xs'
            : 'text-ink-600 hover:text-ink-900'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        title="Dark Mode"
        className={`p-1.5 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-surface-1 text-ink-900 shadow-xs'
            : 'text-ink-600 hover:text-ink-900'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        title="System Preference"
        className={`p-1.5 rounded-md transition-colors ${
          theme === 'system'
            ? 'bg-surface-1 text-ink-900 shadow-xs'
            : 'text-ink-600 hover:text-ink-900'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
