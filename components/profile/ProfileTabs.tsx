'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { FeedItem } from '@/lib/services/recipes';
import { Heart, Bookmark, Utensils } from 'lucide-react';
import Link from 'next/link';

interface ProfileTabsProps {
  userId: string;
}

const tabs = [
  { key: 'my', label: 'Mes plats', Icon: Utensils },
  { key: 'mines', label: 'Mines', Icon: Heart },
  { key: 'saved', label: 'Favoris', Icon: Bookmark },
];

export default function ProfileTabs({ userId }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('my');
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = typeof window !== 'undefined' ? createClient() : null;

  useEffect(() => {
    const fetchItems = async () => {
      if (!supabase) return;
      setLoading(true);

      let recipeIds: string[] = [];

      if (activeTab === 'my') {
        const { data } = await supabase
          .from('recipes')
          .select('id')
          .eq('creator_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);
        recipeIds = (data ?? []).map((r: any) => r.id);
      } else if (activeTab === 'mines') {
        const { data } = await supabase
          .from('mines')
          .select('recipe_id')
          .eq('user_id', userId);
        recipeIds = (data ?? []).map((r: any) => r.recipe_id);
      } else {
        const { data } = await supabase
          .from('saved_recipes')
          .select('recipe_id')
          .eq('user_id', userId);
        recipeIds = (data ?? []).map((r: any) => r.recipe_id);
      }

      if (recipeIds.length > 0) {
        const { data: recipes } = await supabase
          .from('recipes')
          .select('id, title, media_url, thumbnail_url, mines, price_chf, cuisine')
          .in('id', recipeIds);

        setItems(
          (recipes ?? []).map((r: any) => ({
            id: r.id,
            title: r.title,
            mediaUrl: r.media_url,
            thumbnailUrl: r.thumbnail_url,
            mines: r.mines ?? 0,
            priceChf: r.price_chf,
            cuisine: r.cuisine,
            creatorId: userId,
          }))
        );
      } else {
        setItems([]);
      }
      setLoading(false);
    };

    fetchItems();
  }, [activeTab, userId]);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Rien ici pour le moment</p>
      ) : (
        <div className="grid grid-cols-3 gap-px bg-gray-200">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/recipes/${item.id}`}
              className="relative aspect-square bg-white"
            >
              {item.thumbnailUrl || item.mediaUrl ? (
                <img
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <span className="text-lg font-bold text-gray-300">
                    {item.title[0]}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="truncate text-xs text-white">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}