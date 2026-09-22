'use client';

import { Heart, BookmarkPlus, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface FeedActionsProps {
  mines: number;
  isMined?: boolean;
  onMine: () => void;
  onSave: () => void;
  onMakeItMine: () => void;
}

export default function FeedActions({
  mines,
  isMined = false,
  onMine,
  onSave,
  onMakeItMine,
}: FeedActionsProps) {
  const [mined, setMined] = useState(isMined);
  const [minesCount, setMinesCount] = useState(mines);

  const handleMine = () => {
    onMine();
    setMined(!mined);
    setMinesCount((c) => (mined ? c - 1 : c + 1));
  };

  return (
    <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
      {/* Mine */}
      <button
        onClick={handleMine}
        className="flex flex-col items-center gap-0.5"
      >
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            mined ? 'bg-primary text-white' : 'bg-white/20 text-white'
          }`}
        >
          <Heart
            className={`h-6 w-6 ${mined ? 'fill-current' : ''}`}
          />
        </div>
        <span className="text-[11px] font-medium text-white">
          {minesCount > 999 ? '999+' : minesCount}
        </span>
      </button>

      {/* Save */}
      <button
        onClick={onSave}
        className="flex flex-col items-center gap-0.5"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white">
          <BookmarkPlus className="h-6 w-6" />
        </div>
        <span className="text-[11px] text-white">Save</span>
      </button>

      {/* Make it mine */}
      <button
        onClick={onMakeItMine}
        className="flex flex-col items-center gap-0.5"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
        <span className="text-[11px] font-medium text-white">Planifier</span>
      </button>
    </div>
  );
}