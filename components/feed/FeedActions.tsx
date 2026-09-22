'use client';

import { Heart, Sparkles, Send } from 'lucide-react';
import { useState } from 'react';
import type { FeedItem } from '@/lib/services/recipes';

interface FeedActionsProps {
  item: FeedItem;
  isMined?: boolean;
  onMine: () => void;
  onMakeItMine: () => void;
}

export default function FeedActions({
  item,
  isMined = false,
  onMine,
  onMakeItMine,
}: FeedActionsProps) {
  const [mined, setMined] = useState(isMined);
  const [minesCount, setMinesCount] = useState(item.mines);

  const handleMine = () => {
    onMine();
    setMined(!mined);
    setMinesCount((c) => (mined ? c - 1 : c + 1));
  };

  const store = item.priceChf
    ? item.priceChf < 10
      ? { name: 'Coop', price: item.priceChf + 1.2 }
      : { name: 'Migros', price: item.priceChf - 0.8 }
    : null;

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Right column */}
      <div className="pointer-events-auto absolute bottom-28 right-3 flex flex-col items-center gap-4">
        {/* Info panel */}
        <div className="w-max rounded-xl bg-black/40 px-3 py-2 backdrop-blur-sm">
          {item.calories && (
            <div className="flex items-center gap-1.5 text-xs text-white">
              <span>🔥</span>
              <span className="font-semibold">{item.calories}</span>
              <span className="text-white/60">kcal</span>
            </div>
          )}
          {item.totalTime && (
            <div className="flex items-center gap-1.5 text-xs text-white">
              <span>⏱️</span>
              <span className="font-semibold">{item.totalTime}</span>
              <span className="text-white/60">min</span>
            </div>
          )}
          {item.priceChf && (
            <div className="flex items-center gap-1.5 text-xs text-white">
              <span>🛒</span>
              <span className="font-semibold">CHF {item.priceChf.toFixed(2)}</span>
              {store && (
                <span className="text-primary-light">~{store.name}</span>
              )}
            </div>
          )}
        </div>

        {/* Title + description compact */}
        <div className="text-right">
          <h2 className="text-sm font-bold text-white drop-shadow-sm">
            {item.title}
          </h2>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-[11px] text-white/80">
              {item.description}
            </p>
          )}
        </div>

        {/* Mine (like) */}
        <button
          onClick={handleMine}
          className="flex flex-col items-center gap-0.5"
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
              mined
                ? 'bg-mine text-white shadow-lg'
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            <Heart className={`h-6 w-6 ${mined ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[11px] font-medium text-white">
            {minesCount > 999 ? '999+' : minesCount}
          </span>
        </button>

        {/* Share */}
        <button
          className="flex flex-col items-center gap-0.5"
          onClick={() => {
            // Le ShareSheet est intégré via FeedScroll
            const event = new CustomEvent('posplate:share', {
              detail: { recipeId: item.id, title: item.title },
            });
            window.dispatchEvent(event);
          }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30">
            <Send className="h-5 w-5" />
          </div>
          <span className="text-[11px] text-white">Partager</span>
        </button>

        {/* Make it mine */}
        <button
          onClick={onMakeItMine}
          className="flex flex-col items-center gap-0.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-2 ring-primary-light/50">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-sm">
            Planifier
          </span>
        </button>
      </div>
    </div>
  );
}