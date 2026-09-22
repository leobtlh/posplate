import { X } from 'lucide-react';
import type { MealPlanEntry } from '@/hooks/useMealPlan';

interface MealSlotProps {
  entry: MealPlanEntry;
  onRemove: (id: string) => void;
}

export default function MealSlot({ entry, onRemove }: MealSlotProps) {
  return (
    <div className="group relative mb-1 rounded bg-primary-light/30 p-1.5 text-xs">
      <button
        onClick={() => onRemove(entry.id)}
        className="absolute -right-1 -top-1 hidden rounded-full bg-gray-800 p-0.5 text-white group-hover:block"
      >
        <X className="h-2.5 w-2.5" />
      </button>
      <p className="truncate font-medium text-gray-800">{entry.recipeTitle}</p>
      {entry.recipeThumbnail && (
        <img
          src={entry.recipeThumbnail}
          alt=""
          className="mt-1 h-6 w-full rounded object-cover"
        />
      )}
    </div>
  );
}