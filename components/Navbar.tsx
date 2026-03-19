'use client';

import { useState } from 'react';
import { SchoolMode } from '@/lib/types';
import { MODE_LABELS } from '@/lib/utils';

interface NavbarProps {
  mode: SchoolMode;
  onModeChange: (mode: SchoolMode) => void;
  onAddClick: () => void;
}

const NAV_LINKS: Record<SchoolMode, { label: string; href: string }[]> = {
  nursery: [
    { label: '献立', href: '#meal-menu' },
    { label: 'カレンダー', href: '#calendar' },
    { label: '掲示板', href: '#board' },
  ],
  elementary: [
    { label: '献立', href: '#meal-menu' },
    { label: '時間割', href: '#timetable' },
    { label: 'カレンダー', href: '#calendar' },
    { label: '掲示板', href: '#board' },
  ],
};

export default function Navbar({ mode, onModeChange, onAddClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const links = NAV_LINKS[mode];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-serif text-base sm:text-xl font-bold tracking-wide text-gray-800 whitespace-nowrap">
            おたよりボード
          </span>
          <span className="hidden sm:inline-block text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {dateStr}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Mode toggle */}
          <div className="flex bg-gray-100 rounded-full p-0.5">
            {(['nursery', 'elementary'] as SchoolMode[]).map(m => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`text-xs px-2 sm:px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  mode === m
                    ? 'bg-white text-gray-800 shadow-sm font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {MODE_LABELS[m].name}
              </button>
            ))}
          </div>
          {/* Desktop nav links */}
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="hidden lg:inline text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onAddClick}
            className="bg-accent-green hover:bg-green-600 text-white text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">＋ 追加</span>
            <span className="sm:hidden">＋</span>
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-2 flex flex-wrap gap-2">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
