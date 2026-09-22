'use client';

import { Heart, BookmarkPlus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';

interface RecipeActionsProps {
  mines: number;
  isMined?: boolean;
  onMine: () => void;
  onSave: () => void;
  onMakeItMine: () => void;
}

export default function RecipeActions({
  mines,
  isMined = false,
  onMine,
  onSave,
  onMakeItMine,
}: RecipeActionsProps) {
  const [mined, setMined] = useState(isMined);
  const [minesCount, setMinesCount] = useState(mines);

  const handleMine = () => {
    onMine();
    setMined(!mined);
    setMinesCount((c) => (mined ? c - 1 : c + 1));
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" onClick={handleMine} className="flex items-center gap-1">
        <Heart className={`h-5 w-5 ${mined ? 'fill-red-500 text-red-500' : ''}`} />
        <span>{minesCount}</span>
      </Button>
      <Button variant="ghost" onClick={onSave} className="flex items-center gap-1">
        <BookmarkPlus className="h-5 w-5" />
        <span className="text-xs">Sauvegarder</span>
      </Button>
      <Button onClick={onMakeItMine} className="ml-auto flex items-center gap-1">
        <Sparkles className="h-4 w-4" />
        Make it mine
      </Button>
    </div>
  );
}