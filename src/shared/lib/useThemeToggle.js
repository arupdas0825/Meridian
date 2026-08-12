'use client';

import { useEffect, useState } from 'react';

export function useThemeToggle() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const stored = localStorage.getItem('meridian-theme') || 'system';
    setTheme(stored);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const resolve = () => (theme === 'system' ? mql.matches : theme === 'dark');
    const apply = () => {
      const isDark = resolve();
      document.documentElement.classList.toggle('dark', isDark);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', isDark ? '#0B0E14' : '#FAF8F4');
    };
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, [theme]);

  const setAndStore = (next) => {
    localStorage.setItem('meridian-theme', next);
    setTheme(next);
  };

  return { theme, setTheme: setAndStore };
}
