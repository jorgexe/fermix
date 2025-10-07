import type { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
