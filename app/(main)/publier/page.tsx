'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { useUser } from '@/hooks/useUser';
import { Loader2, ImagePlus, Sparkles } from 'lucide-react';

export default function PublierPage() {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [calories, setCalories] = useState('');
  const [portions, setPortions] = useState('1');
  const [rawInput, setRawInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAiParse = async () => {
    if (!rawInput.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawInput }),
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.cuisine) setCuisine(data.cuisine);
      if (data.difficulty) setDifficulty(data.difficulty);
      if (data.prep_time) setPrepTime(String(data.prep_time));
      if (data.cook_time) setCookTime(String(data.cook_time));
      if (data.calories) setCalories(String(data.calories));
      if (data.portions) setPortions(String(data.portions));
    } catch { /* ignore */ }
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.from('recipes').insert({
      creator_id: user.id,
      title,
      description,
      cuisine: cuisine || null,
      difficulty: difficulty || null,
      prep_time: prepTime ? Number(prepTime) : null,
      cook_time: cookTime ? Number(cookTime) : null,
      calories: calories ? Number(calories) : null,
      portions: Number(portions),
    });

    if (!error) setSuccess(true);
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <h2 className="text-xl font-bold text-primary">Recette publiée !</h2>
        <p className="mt-1 text-sm text-gray-500">Elle apparaît dans le feed</p>
        <a href="/" className="mt-4">
          <Button>Voir le feed</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="px-4 py-5">
      <h1 className="text-lg font-bold mb-5">Publier une recette</h1>

      {/* AI Assistant */}
      <div className="mb-6 rounded-lg border border-primary/20 bg-primary-light/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Assistant IA</h2>
        </div>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="Décris ta recette en langage naturel..."
          rows={3}
          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button
          size="sm"
          onClick={handleAiParse}
          disabled={aiLoading || !rawInput.trim()}
          className="mt-2"
        >
          {aiLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Générer avec Claude'
          )}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cuisine</label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="ex: italienne"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulté</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">—</option>
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prép. (min)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cuisson (min)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Calories</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Portions</label>
          <input
            type="number"
            value={portions}
            onChange={(e) => setPortions(e.target.value)}
            min={1}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button type="submit" disabled={submitting || !user} className="w-full">
          {submitting ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Publier'}
        </Button>
      </form>
    </div>
  );
}