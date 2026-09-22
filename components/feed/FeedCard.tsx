'use client';

import type { FeedItem } from '@/lib/services/recipes';

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
          <span className="text-4xl font-bold text-white">
            {item.title[0]}
          </span>
        </div>
      )}

      {/* Gradient overlay plus subtil pour l'info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
    </div>
  );
}