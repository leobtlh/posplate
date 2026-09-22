'use client';

import { useUser } from '@/hooks/useUser';
import FeedScroll from '@/components/feed/FeedScroll';

export default function FeedPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-100px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <FeedScroll userId={user?.id ?? null} />;
}