'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Demo' },
  { href: '/dataset', label: 'Dataset' },
  { href: '/visuals', label: 'Visuals' },
  { href: '/video', label: 'Video' },
  { href: '/model', label: 'Model' },
  { href: '/about', label: 'About' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-white">
          FermiX
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-3 py-2 text-sm text-white shadow-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 sm:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden items-center gap-8 text-sm font-medium text-white/70 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative transition-colors hover:text-white ${
                isActive(item.href) ? 'text-white' : ''
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-0 -bottom-2 h-[2px] rounded-full bg-white/90" />
              )}
            </Link>
          ))}
          <a
            href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '/api/v1/docs') || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="relative transition-colors text-white/70 hover:text-white"
          >
            API Docs
          </a>
        </div>
      </nav>

      {/* Mobile navigation */}
      <div
        className={`sm:hidden transition-[max-height] duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96' : 'max-h-0'
        } overflow-hidden border-t border-white/10 bg-black/90 text-white backdrop-blur-lg shadow-lg`}
      >
        <div className="space-y-1 px-4 py-4 text-sm font-medium text-white/80">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                isActive(item.href)
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5'
              }`}
            >
              {item.label}
              {isActive(item.href) && <span className="text-xs uppercase">Now</span>}
            </Link>
          ))}
          <a
            href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '/api/v1/docs') || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
            onClick={() => setIsMenuOpen(false)}
          >
            API Docs
            <span className="text-xs uppercase">New</span>
          </a>
        </div>
      </div>
    </header>
  );
}
