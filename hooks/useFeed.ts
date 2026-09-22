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
import { supabase } from '@/lib/supabase';
import { getRecommendations } from '@/lib/feed/gorse';

const PAGE_SIZE = 20;

export type FeedItem = {
  id: string;
  creatorId: string;
  cuisine: string | null;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  mines: number;
  priceChf?: number;
};

type FeedState = {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
};

/**
 * Récupère les détails Supabase pour une liste d'IDs, en conservant l'ordre
 * de recommandation fourni par Gorse.
 */
async function fetchRecipesByIds(ids: string[]): Promise<FeedItem[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('recipes')
    .select(
      'id, creator_id, cuisine, media_url, thumbnail_url, caption, mines, price_chf'
    )
    .in('id', ids);

  if (error) throw error;

  const byId = new Map<string, FeedItem>();
  for (const row of data ?? []) {
    byId.set(row.id, {
      id: row.id,
      creatorId: row.creator_id,
      cuisine: row.cuisine,
      mediaUrl: row.media_url,
      thumbnailUrl: row.thumbnail_url,
      caption: row.caption,
      mines: row.mines ?? 0,
      priceChf: row.price_chf,
    });
  }

  // Conserver l'ordre de Gorse
  return ids.map((id) => byId.get(id)).filter(Boolean) as FeedItem[];
}

/**
 * Fallback cold start : recettes populaires/récentes depuis Supabase.
 * Utilisé quand Gorse n'a pas encore assez de données sur l'utilisateur.
 */
async function fetchColdStart(limit: number): Promise<FeedItem[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(
      'id, creator_id, cuisine, media_url, thumbnail_url, caption, mines, price_chf'
    )
    .order('mines', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    creatorId: row.creator_id,
    cuisine: row.cuisine,
    mediaUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url,
    caption: row.caption,
    mines: row.mines ?? 0,
    priceChf: row.price_chf,
  }));
}

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
      let items: FeedItem[] = [];

      if (userId) {
        // 1. Recommandations personnalisées Gorse
        try {
          // On demande un peu plus pour compenser les déjà-vus
          const recos = await getRecommendations(userId, PAGE_SIZE * 2);
          const freshIds = recos
            .map((r) => r.Id)
            .filter((id) => !seenIdsRef.current.has(id))
            .slice(0, PAGE_SIZE);

          if (freshIds.length > 0) {
            items = await fetchRecipesByIds(freshIds);
          }
        } catch {
          // Gorse indisponible ou vide : on bascule sur le cold start
          items = [];
        }
      }

      // 2. Fallback cold start (nouvel utilisateur, Gorse vide ou en erreur)
      if (items.length === 0) {
        const fallback = await fetchColdStart(PAGE_SIZE);
        items = fallback.filter((i) => !seenIdsRef.current.has(i.id));
      }

      if (items.length === 0) {
        setState((s) => ({ ...s, loading: false, hasMore: false }));
        return;
      }

      // Mémoriser les IDs vus pour éviter les répétitions
      items.forEach((i) => seenIdsRef.current.add(i.id));

      setState((s) => ({
        items: [...s.items, ...items],
        loading: false,
        error: null,
        hasMore: items.length === PAGE_SIZE,
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
  }, [state.hasMore, userId]);

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
