/**
 * Hook de feed basé sur Gorse (open-source, gratuit).
 *
 * Stratégie :
 *  1. On demande les recommandations personnalisées à Gorse.
 *  2. Si l'utilisateur est nouveau (cold start) ou si Gorse est indisponible,
 *     on retombe sur les recettes "populaires / récentes" de Supabase.
 *  3. On récupère les détails complets des recettes depuis Supabase à partir
 *     des IDs recommandés par Gorse.
 *
 * Gorse ne stocke que les IDs et le scoring : les données métier restent dans Supabase.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadFeedPage, type FeedItem } from '@/lib/services/recipes';

type FeedState = {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
};

export function useFeed(userId: string | null) {
  const [state, setState] = useState<FeedState>({
    items: [],
    loading: false,
    error: null,
    hasMore: true,
  });

  const seenIdsRef = useRef<Set<string>>(new Set());
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !state.hasMore) return;
    loadingRef.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const result = await loadFeedPage(userId, seenIdsRef.current);
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
        error: e?.message ?? 'Erreur de chargement du feed',
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [userId, state.hasMore]);

  // Chargement initial
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    loadMore,
  };
}