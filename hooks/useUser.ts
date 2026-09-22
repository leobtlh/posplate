'use client';

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = typeof window !== 'undefined' ? createClient() : null;

  useEffect(() => {
    if (!supabase) return;

    const getInitial = async () => {
      const {
        data: { user: initialUser },
      } = await supabase.auth.getUser();
      setUser(initialUser ?? null);
      setLoading(false);
    };
    getInitial();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
  }, [supabase]);

  return { user, loading, signOut };
}