'use client';

interface HouseholdSelectorProps {
  householdId?: string;
  onChange: (id: string | undefined) => void;
}

// Pour le MVP on affiche un toggle simple.
// Version 2 : dropdown avec création de foyer.

export default function HouseholdSelector({
  householdId,
  onChange,
}: HouseholdSelectorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!householdId}
          onChange={(e) => onChange(e.target.checked ? 'default' : undefined)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        Planning pour un foyer
      </label>
    </div>
  );
}