'use client';

import Button from '@/components/ui/Button';

interface PaywallModalProps {
  onClose: () => void;
  onSubscribe: (priceId: string) => void;
}

export default function PaywallModal({ onClose, onSubscribe }: PaywallModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-center">✨ Premium</h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Débloque des recettes illimitées
        </p>

        <div className="mt-6 space-y-3">
          <div className="rounded-lg border border-primary/20 bg-primary-light/20 p-4">
            <p className="text-lg font-bold text-primary">CHF 5.90 / mois</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>✓ Recettes illimitées</li>
              <li>✓ Assistant IA Claude</li>
              <li>✓ Planning hebdomadaire complet</li>
              <li>✓ Comparateur de prix Coop/Migros</li>
              <li>✓ Liste de courses automatique</li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-lg font-bold">CHF 49.00 / an</p>
            <p className="text-xs text-green-600">Économise 20%</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>✓ Tout ce qui est inclus dans le plan mensuel</li>
              <li>✓ 🎁 1 mois offert</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Button
            className="w-full"
            onClick={() => onSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!)}
          >
            Essai gratuit 7 jours
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!)}
          >
            Abonnement annuel
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Plus tard
          </Button>
        </div>
      </div>
    </div>
  );
}