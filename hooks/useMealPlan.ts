'use client';

import { createClient } from '@/lib/supabase/client';
import { useCallback, useState } from 'react';

export interface MealPlanEntry {
  id: string;
  recipeId: string;
  planDate: string;
  mealType: 'lunch' | 'dinner' | 'snack';
  recipeTitle: string;
  recipeThumbnail?: string;
  servings: number;
}

export function useMealPlan(userId: string | null) {
  const [entries, setEntries] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = typeof window !== 'undefined' ? createClient() : null;

  const loadWeek = useCallback(
    async (weekStart: string, householdId?: string) => {
      if (!userId || !supabase) return;
      setLoading(true);

      let query = supabase
        .from('meal_plans')
        .select('id, recipe_id, plan_date, meal_type, servings')
        .gte('plan_date', weekStart)
        .lte('plan_date', getEndOfWeek(weekStart));

      if (householdId) {
        query = query.eq('household_id', householdId);
      } else {
        query = query.is('household_id', null).eq('user_id', userId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Fetch recipe titles separately
        const recipeIds = [...new Set(data.map((r: any) => r.recipe_id))];
        const { data: recipes } = await supabase
          .from('recipes')
          .select('id, title, thumbnail_url')
          .in('id', recipeIds);

        const recipeMap = new Map();
        for (const r of recipes ?? []) recipeMap.set(r.id, r);

        setEntries(
          data.map((row: any) => ({
            id: row.id,
            recipeId: row.recipe_id,
            planDate: row.plan_date,
            mealType: row.meal_type,
            recipeTitle: recipeMap.get(row.recipe_id)?.title ?? '',
            recipeThumbnail: recipeMap.get(row.recipe_id)?.thumbnail_url,
            servings: row.servings ?? 1,
          }))
        );
      } else {
        setEntries([]);
      }
      setLoading(false);
    },
    [userId, supabase]
  );

  const addToPlan = async (
    recipeId: string,
    planDate: string,
    mealType: 'lunch' | 'dinner' | 'snack',
    householdId?: string
  ) => {
    if (!supabase) throw new Error('Supabase non disponible');
    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        user_id: userId,
        recipe_id: recipeId,
        plan_date: planDate,
        meal_type: mealType,
        household_id: householdId ?? null,
      })
      .select('id, recipe_id, plan_date, meal_type, servings')
      .single();

    if (error) throw error;

    // Fetch recipe title separately
    const { data: recipe } = await supabase
      .from('recipes')
      .select('title, thumbnail_url')
      .eq('id', recipeId)
      .single();

    const newEntry: MealPlanEntry = {
      id: data.id,
      recipeId: data.recipe_id,
      planDate: data.plan_date,
      mealType: data.meal_type,
      recipeTitle: recipe?.title ?? '',
      recipeThumbnail: recipe?.thumbnail_url,
      servings: data.servings ?? 1,
    };
    setEntries((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const removeFromPlan = async (entryId: string) => {
    if (!supabase) return;
    await supabase.from('meal_plans').delete().eq('id', entryId);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  return { entries, loading, loadWeek, addToPlan, removeFromPlan };
}

function getEndOfWeek(start: string): string {
  const d = new Date(start);
  d.setDate(d.getDate() + 6);
  return d.toISOString().split('T')[0];
}