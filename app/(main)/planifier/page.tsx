'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useMealPlan } from '@/hooks/useMealPlan';
import WeekCalendar from '@/components/planning/WeekCalendar';
import AddToPlanModal from '@/components/planning/AddToPlanModal';
import { startOfWeek } from 'date-fns';

export default function PlanifierPage() {
  const { user } = useUser();
  const { entries, loading, loadWeek, addToPlan, removeFromPlan } = useMealPlan(user?.id ?? null);
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    return startOfWeek(now, { weekStartsOn: 1 });
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState<{
    recipeId: string;
    date: string;
    mealType: 'lunch' | 'dinner';
  } | null>(null);

  const weekStartStr = currentWeek.toISOString().split('T')[0];

  useEffect(() => {
    if (user) loadWeek(weekStartStr);
  }, [user, weekStartStr]);

  const handleAddClick = (date: string, mealType: 'lunch' | 'dinner') => {
    // Pour le MVP, on utilise un ID factice. En vrai, ça viendrait du feed ou d'une recette.
    setModalProps({ recipeId: '', date, mealType });
    setModalOpen(true);
  };

  const handleConfirm = async (recipeId: string, date: string, mealType: 'lunch' | 'dinner' | 'snack') => {
    await addToPlan(recipeId, date, mealType);
  };

  const navigateWeek = (direction: 1 | -1) => {
    setCurrentWeek((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7 * direction);
      return d;
    });
  };

  return (
    <div>
      <WeekCalendar
        currentWeek={currentWeek}
        onPrevWeek={() => navigateWeek(-1)}
        onNextWeek={() => navigateWeek(1)}
        entries={entries}
        onRemoveEntry={removeFromPlan}
        onAddClick={handleAddClick}
      />

      {modalProps && (
        <AddToPlanModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          recipeId={modalProps.recipeId}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}