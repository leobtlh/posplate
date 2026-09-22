'use client';

interface FilterBarProps {
  current?: string;
  onChange: (cuisine: string | undefined) => void;
}

const cuisines = [
  { value: undefined, label: 'Tout' },
  { value: 'italienne', label: 'Italienne' },
  { value: 'asiatique', label: 'Asiatique' },
  { value: 'française', label: 'Française' },
  { value: 'suisse', label: 'Suisse' },
  { value: 'mexicaine', label: 'Mexicaine' },
  { value: 'indienne', label: 'Indienne' },
  { value: 'orientale', label: 'Orientale' },
  { value: 'autre', label: 'Autre' },
];

export default function FilterBar({ current, onChange }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-20 flex gap-2 overflow-x-auto bg-white/95 px-4 py-2 backdrop-blur-sm hide-scrollbar">
      {cuisines.map(({ value, label }) => (
        <button
          key={label}
          onClick={() => onChange(value)}
          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            current === value || (!current && !value)
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}