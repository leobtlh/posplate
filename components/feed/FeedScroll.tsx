'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadFeedPage, type FeedItem } from '@/lib/services/recipes';
import { createClient } from '@/lib/supabase/client';
import FeedCard from '@/components/feed/FeedCard';
import FeedActions from '@/components/feed/FeedActions';
import FilterBar from '@/components/feed/FilterBar';
import AddToPlanModal from '@/components/planning/AddToPlanModal';
import { useMealPlan } from '@/hooks/useMealPlan';

type FeedState = {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
};

export default function FeedScroll({ userId }: { userId: string | null }) {
  const [state, setState] = useState<FeedState>({
    items: [],
    loading: false,
    error: null,
    hasMore: true,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState<{ cuisine?: string }>({});
  const [planTarget, setPlanTarget] = useState<FeedItem | null>(null);

  const seenIdsRef = useRef<Set<string>>(new Set());
  const loadingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = typeof window !== 'undefined' ? createClient() : null;
  const { addToPlan } = useMealPlan(userId);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !state.hasMore) return;
    loadingRef.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const result = await loadFeedPage(userId, seenIdsRef.current, filters);
      result.items.forEach((i) => seenIdsRef.current.add(i.id));

      setState((s) => ({
        items: [...s.items, ...result.items],
        loading: false,
        error: null,
        hasMore: result.hasMore,
      }));
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e?.message ?? 'Erreur de chargement',
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [userId, state.hasMore, filters]);

  useEffect(() => { loadMore(); }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setCurrentIndex(index);

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      loadMore();
    }
  }, [loadMore]);

  const handleMine = async (recipeId: string) => {
    if (!supabase) return;
    const { data: existing } = await supabase
      .from('mines')
      .select()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single();

    if (existing) {
      await supabase.from('mines').delete().eq('user_id', userId).eq('recipe_id', recipeId);
    } else {
      await supabase.from('mines').insert({ user_id: userId, recipe_id: recipeId });
    }
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feedbackType: existing ? 'unmine' : 'mine',
        recipeId,
      }),
    });
  };

  const handleSave = async (recipeId: string) => {
    if (!supabase) return;
    await supabase.from('saved_recipes').insert({ user_id: userId, recipe_id: recipeId });
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedbackType: 'save', recipeId }),
    });
  };

  const handleMakeItMine = async (
    recipeId: string,
    date: string,
    mealType: 'lunch' | 'dinner' | 'snack'
  ) => {
    await addToPlan(recipeId, date, mealType);
  };

  return (
    <div className="relative">
      <FilterBar
        current={filters.cuisine}
        onChange={(cuisine) => {
          setFilters({ cuisine });
          setState({ items: [], loading: false, error: null, hasMore: true });
          seenIdsRef.current.clear();
          loadMore();
        }}
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[calc(100dvh-120px)] overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      >
        {state.items.length === 0 && state.loading && (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {state.error && (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-red-500">
            {state.error}
          </div>
        )}

        {state.items.map((item, i) => (
          <div key={item.id} className="relative h-full snap-start">
            <FeedCard
              item={item}
              isActive={i === currentIndex}
            />
            <FeedActions
              mines={item.mines}
              onMine={() => handleMine(item.id)}
              onSave={() => handleSave(item.id)}
              onMakeItMine={() => setPlanTarget(item)}
            />
          </div>
        ))}

        {state.loading && state.items.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {planTarget && (
        <AddToPlanModal
          open={!!planTarget}
          onClose={() => setPlanTarget(null)}
          recipeId={planTarget.id}
          onConfirm={handleMakeItMine}
        />
      )}
    </div>
  );
}