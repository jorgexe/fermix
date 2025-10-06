'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rocket } from 'lucide-react';

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

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Rocket className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Fermix</span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '/api/v1/docs') || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              API Docs
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
