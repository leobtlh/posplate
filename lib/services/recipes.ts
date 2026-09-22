import { createClient } from '@/lib/supabase/client';
import { getRecommendations } from '@/lib/feed/gorse';

const PAGE_SIZE = 20;

export type FeedItem = {
  id: string;
  creatorId: string;
  cuisine: string | null;
  mediaUrl: string;
  thumbnailUrl?: string;
  description?: string;
  mines: number;
  priceChf?: number;
  title: string;
  difficulty?: string;
  prepTime?: number;
  totalTime?: number;
  calories?: number;
  portions?: number;
  creatorName?: string;
};

async function fetchRecipesByIds(ids: string[]): Promise<FeedItem[]> {
  if (ids.length === 0) return [];
  const supabase = createClient();

  const { data, error } = await supabase
    .from('recipes')
    .select(
      'id, creator_id, cuisine, media_url, thumbnail_url, description, mines, price_chf, title, difficulty, prep_time, cook_time, calories, portions'
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
      description: row.description,
      mines: row.mines ?? 0,
      priceChf: row.price_chf,
      title: row.title,
      difficulty: row.difficulty,
      prepTime: row.prep_time,
      totalTime: (row.prep_time ?? 0) + (row.cook_time ?? 0),
      calories: row.calories,
      portions: row.portions,
    });
  }

  return ids.map((id) => byId.get(id)).filter(Boolean) as FeedItem[];
}

async function fetchColdStart(limit: number): Promise<FeedItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('recipes')
    .select(
      'id, creator_id, cuisine, media_url, thumbnail_url, description, mines, price_chf, title, difficulty, prep_time, cook_time, calories, portions'
    )
    .order('mines', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row: Record<string, any>) => ({
    id: row.id,
    creatorId: row.creator_id,
    cuisine: row.cuisine,
    mediaUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url,
    description: row.description,
    mines: row.mines ?? 0,
    priceChf: row.price_chf,
    title: row.title,
    difficulty: row.difficulty,
    prepTime: row.prep_time,
    totalTime: (row.prep_time ?? 0) + (row.cook_time ?? 0),
    calories: row.calories,
    portions: row.portions,
  }));
}

export async function loadFeedPage(
  userId: string | null,
  seenIds: Set<string>,
  filters?: { cuisine?: string }
): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  let items: FeedItem[] = [];

  if (userId) {
    try {
      const recos = await getRecommendations(userId, PAGE_SIZE * 2);
      const freshIds = recos
        .map((r) => r.Id)
        .filter((id) => !seenIds.has(id))
        .slice(0, PAGE_SIZE);

      if (freshIds.length > 0) {
        items = await fetchRecipesByIds(freshIds);
      }
    } catch {
      items = [];
    }
  }

  if (items.length === 0) {
    const fallback = await fetchColdStart(PAGE_SIZE);
    items = fallback.filter((i) => !seenIds.has(i.id));
  }

  if (filters?.cuisine) {
    items = items.filter((i) => i.cuisine === filters.cuisine);
  }

  return { items, hasMore: items.length === PAGE_SIZE };
}