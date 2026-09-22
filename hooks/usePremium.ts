'use client';

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';

export function usePremium(userId: string | null) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = typeof window !== 'undefined' ? createClient() : null;

  useEffect(() => {
    if (!userId || !supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        setIsPremium(data?.is_premium ?? false);
        setLoading(false);
      });
  }, [userId, supabase]);

  const createCheckout = useCallback(
    async (priceId: string) => {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    },
    [userId]
  );

  return { isPremium, loading, createCheckout };
}