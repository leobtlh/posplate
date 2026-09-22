'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, format, startOfWeek } from 'date-fns';
import DayColumn from './DayColumn';
import type { MealPlanEntry } from '@/hooks/useMealPlan';

interface WeekCalendarProps {
  currentWeek: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  entries: MealPlanEntry[];
  onRemoveEntry: (id: string) => void;
  onAddClick: (date: string, mealType: 'lunch' | 'dinner') => void;
}

export default function WeekCalendar({
  currentWeek,
  onPrevWeek,
  onNextWeek,
  entries,
  onRemoveEntry,
  onAddClick,
}: WeekCalendarProps) {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekLabel = `${format(weekStart, 'd MMM')} – ${format(addDays(weekStart, 6), 'd MMM yyyy')}`;

  const getEntriesForDay = (date: Date, mealType: 'lunch' | 'dinner') =>
    entries.filter(
      (e) => e.planDate === format(date, 'yyyy-MM-dd') && e.mealType === mealType
    );

  return (
    <div>
      {/* Navigation semaine */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onPrevWeek} className="rounded-full p-1 hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">{weekLabel}</span>
        <button onClick={onNextWeek} className="rounded-full p-1 hover:bg-gray-100">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayName = format(day, 'EEE');
          const dayNum = format(day, 'd');

          return (
            <div key={dateStr} className="bg-white px-1 py-2 text-center">
              <p className="text-[10px] uppercase text-gray-400">{dayName}</p>
              <p className="text-sm font-bold">{dayNum}</p>
            </div>
          );
        })}
      </div>

      {/* Colonnes jour */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          return (
            <DayColumn
              key={dateStr}
              date={dateStr}
              lunchEntries={getEntriesForDay(day, 'lunch')}
              dinnerEntries={getEntriesForDay(day, 'dinner')}
              onRemoveEntry={onRemoveEntry}
              onAddClick={onAddClick}
            />
          );
        })}
      </div>
    </div>
  );
}