'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { format } from 'date-fns';

interface AddToPlanModalProps {
  open: boolean;
  onClose: () => void;
  recipeId: string;
  onConfirm: (
    recipeId: string,
    date: string,
    mealType: 'lunch' | 'dinner' | 'snack'
  ) => Promise<void>;
}

export default function AddToPlanModal({
  open,
  onClose,
  recipeId,
  onConfirm,
}: AddToPlanModalProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [date, setDate] = useState(format(tomorrow, 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState<'lunch' | 'dinner'>('dinner');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(recipeId, date, mealType);
      onClose();
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Make it mine">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repas
          </label>
          <div className="flex gap-2">
            {(['lunch', 'dinner'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  mealType === type
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'lunch' ? 'Midi' : 'Soir'}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Ajout...' : 'Ajouter au planning'}
        </Button>
      </div>
    </Modal>
  );
}