'use client';

import { Users, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';

interface ShareSheetProps {
  recipeId: string;
  recipeTitle: string;
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

type Friend = {
  id: string;
  name: string;
  avatar?: string;
};

export default function ShareSheet({
  recipeId,
  recipeTitle,
  userId,
  open,
  onClose,
}: ShareSheetProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const supabase = typeof window !== 'undefined' ? createClient() : null;

  useEffect(() => {
    if (!open || !supabase || !userId) return;

    async function loadFriends() {
      const { data: memberships } = await supabase!
        .from('household_members')
        .select('household_id')
        .eq('user_id', userId);

      if (!memberships || memberships.length === 0) return;

      const householdIds = memberships.map((m: any) => m.household_id);

      const { data: members } = await supabase!
        .from('household_members')
        .select('user_id, profiles!inner(username, avatar_url)')
        .in('household_id', householdIds)
        .not('user_id', 'eq', userId);

      if (members) {
        const mapped = members.map((m: any) => ({
          id: m.user_id,
          name: m.profiles?.username ?? 'Inconnu',
          avatar: m.profiles?.avatar_url,
        }));
        const unique = new Map(mapped.map((f: Friend) => [f.id, f]));
        setFriends(Array.from(unique.values()));
      }
    }

    setSentTo(new Set());
    loadFriends();
  }, [open, supabase, userId]);

  const handleSend = (friendId: string) => {
    setSentTo((prev) => new Set(prev).add(friendId));
  };

  return (
    <Modal open={open} onClose={onClose} title="Partager la recette">
      <p className="mb-4 text-sm text-gray-500">
        Envoyer « {recipeTitle} » à un membre du foyer
      </p>

      {friends.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-6 text-gray-400">
          <Users className="h-10 w-10" />
          <p className="text-sm">Aucun membre dans votre foyer</p>
          <p className="text-xs">Ajoutez des membres depuis votre profil</p>
        </div>
      ) : (
        <div className="space-y-2">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                  {friend.name[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium">{friend.name}</span>
              </div>
              <button
                onClick={() => handleSend(friend.id)}
                disabled={sentTo.has(friend.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  sentTo.has(friend.id)
                    ? 'bg-primary-light text-primary'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {sentTo.has(friend.id) ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Envoyé
                  </span>
                ) : (
                  'Envoyer'
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}