import { Plus } from 'lucide-react';
import MealSlot from './MealSlot';
import type { MealPlanEntry } from '@/hooks/useMealPlan';

interface DayColumnProps {
  date: string;
  lunchEntries: MealPlanEntry[];
  dinnerEntries: MealPlanEntry[];
  onRemoveEntry: (id: string) => void;
  onAddClick: (date: string, mealType: 'lunch' | 'dinner') => void;
}

export default function DayColumn({
  date,
  lunchEntries,
  dinnerEntries,
  onRemoveEntry,
  onAddClick,
}: DayColumnProps) {
  return (
    <div className="bg-white p-1.5">
      {/* Déjeuner */}
      <div className="mb-2">
        <p className="text-[10px] font-medium uppercase text-gray-400 mb-1">Midi</p>
        {lunchEntries.map((entry) => (
          <MealSlot key={entry.id} entry={entry} onRemove={onRemoveEntry} />
        ))}
        <button
          onClick={() => onAddClick(date, 'lunch')}
          className="mt-1 flex w-full items-center justify-center rounded border border-dashed border-gray-300 py-1 text-gray-400 hover:border-primary hover:text-primary"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Dîner */}
      <div>
        <p className="text-[10px] font-medium uppercase text-gray-400 mb-1">Soir</p>
        {dinnerEntries.map((entry) => (
          <MealSlot key={entry.id} entry={entry} onRemove={onRemoveEntry} />
        ))}
        <button
          onClick={() => onAddClick(date, 'dinner')}
          className="mt-1 flex w-full items-center justify-center rounded border border-dashed border-gray-300 py-1 text-gray-400 hover:border-primary hover:text-primary"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}