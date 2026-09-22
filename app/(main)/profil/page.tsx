'use client';

import { useUser } from '@/hooks/useUser';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { LogOut, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProfilPage() {
  const { user, loading, signOut } = useUser();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <UserIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold">Connecte-toi</h2>
        <p className="text-sm text-gray-500 mb-4">
          Pour voir ton profil et tes recettes
        </p>
        <a href="/login">
          <Button>Se connecter</Button>
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col items-center px-4 py-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
          {(user.user_metadata?.username?.[0] ?? user.email?.[0] ?? '?').toUpperCase()}
        </div>
        <h1 className="mt-3 text-lg font-bold">
          {user.user_metadata?.username ?? user.email}
        </h1>
        <p className="text-sm text-gray-400">{user.email}</p>

        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="mt-3 flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      {/* Tabs */}
      <ProfileTabs userId={user.id} />
    </div>
  );
}