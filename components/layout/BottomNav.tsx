'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Calendar, Heart, User } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Feed', Icon: Compass },
  { href: '/planifier', label: 'Planifier', Icon: Calendar },
  { href: '/profil', label: 'Profil', Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}