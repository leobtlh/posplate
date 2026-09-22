'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';

interface FilterSheetProps {
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

export default function FilterSheet({ current, onChange }: FilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Filtre button — top right floating */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-0.5"
        title="Filtrer"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30">
          <Filter className="h-5 w-5" />
        </div>
        <span className="text-[11px] font-medium text-white">Filtres</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Filtrer par cuisine">
        <div className="grid grid-cols-2 gap-2">
          {cuisines.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => {
                onChange(value);
                setOpen(false);
              }}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                current === value || (!current && !value)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}