'use client';

import { ShoppingBag } from 'lucide-react';
import type { RecipePricing } from '@/lib/services/pricing';

interface PriceDisplayProps {
  pricing: RecipePricing | null;
  loading?: boolean;
}

export default function PriceDisplay({ pricing, loading }: PriceDisplayProps) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg bg-gray-100 p-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!pricing || (!pricing.totalCoop && !pricing.totalMigros)) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <ShoppingBag className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Comparateur de prix</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className={`rounded-lg p-3 text-center ${
            pricing.cheapestStore === 'coop'
              ? 'bg-primary-light ring-2 ring-primary'
              : 'bg-gray-50'
          }`}
        >
          <p className="text-xs text-gray-500">Coop</p>
          <p className="text-lg font-bold">
            {pricing.totalCoop !== null
              ? `CHF ${pricing.totalCoop.toFixed(2)}`
              : '—'}
          </p>
        </div>
        <div
          className={`rounded-lg p-3 text-center ${
            pricing.cheapestStore === 'migros'
              ? 'bg-primary-light ring-2 ring-primary'
              : 'bg-gray-50'
          }`}
        >
          <p className="text-xs text-gray-500">Migros</p>
          <p className="text-lg font-bold">
            {pricing.totalMigros !== null
              ? `CHF ${pricing.totalMigros.toFixed(2)}`
              : '—'}
          </p>
        </div>
      </div>

      {pricing.cheapestStore && pricing.savings && (
        <p className="mt-2 text-center text-xs text-green-600">
          Économise CHF {pricing.savings.toFixed(2)} chez {pricing.cheapestStore}
        </p>
      )}
    </div>
  );
}