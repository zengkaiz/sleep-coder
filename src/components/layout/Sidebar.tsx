'use client';

import Link from 'next/link';
import { useState } from 'react';

const navigationItems = [
  { name: '首页', href: '/' },
  { name: '设置', href: '/settings' }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition hover:bg-blue-600 md:hidden"
      >
        <span className="text-xl">≡</span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white px-6 py-8 transition duration-300 md:static md:inset-auto md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
              SC
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Sleep Coder</p>
              <p className="text-sm text-slate-500">Layout System</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-lg px-4 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
