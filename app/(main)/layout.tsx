'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { Compass, Calendar, User, Plus } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-lg min-h-screen bg-surface">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md">
        <Link href="/" className="text-xl font-bold text-primary">
          posplate
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/publier"
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              pathname === '/publier'
                ? 'bg-primary text-white'
                : 'bg-secondary/50 text-primary'
            }`}
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-20">{children}</main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}