'use client';

import type { FeedItem } from '@/lib/services/recipes';
import { Clock, DollarSign, Flame } from 'lucide-react';
import Link from 'next/link';

interface FeedCardProps {
  item: FeedItem;
  isActive: boolean;
}

export default function FeedCard({ item, isActive }: FeedCardProps) {
  return (
    <div className="relative h-full w-full bg-gray-900">
      {/* Media */}
      {item.mediaUrl ? (
        <img
          src={item.mediaUrl}
          alt={item.title}
          className="h-full w-full object-cover"
          loading={isActive ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
          <span className="text-4xl font-bold text-white">{item.title[0]}</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Info bottom */}
      <div className="absolute bottom-4 left-4 right-20">
        <Link href={`/recipes/${item.id}`}>
          <h2 className="text-lg font-bold text-white drop-shadow-sm">
            {item.title}
          </h2>
        </Link>

        <div className="mt-1 flex flex-wrap gap-3 text-sm text-white/90">
          {item.priceChf && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" /> CHF {item.priceChf?.toFixed(2)}
            </span>
          )}
          {item.totalTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {item.totalTime} min
            </span>
          )}
          {item.calories && (
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" /> {item.calories} kcal
            </span>
          )}
          {item.difficulty && (
            <span className="rounded bg-white/20 px-2 py-0.5 text-xs">
              {item.difficulty}
            </span>
          )}
        </div>

        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/80">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}