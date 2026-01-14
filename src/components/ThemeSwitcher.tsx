"use client";

import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const themes = {
  light: 'light',
  dark: 'dark',
};

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(themes.dark);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved as keyof typeof themes);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(themes.dark);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="p-2 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="w-[18px] h-[18px]" />
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === themes.light ? themes.dark : themes.light)}
      className="p-2 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
      aria-label="Toggle Theme"
    >
      {theme === themes.light ? <FaMoon size={18} /> : <FaSun size={18} />}
    </button>
  );
}

