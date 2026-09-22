import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import RecipeHeader from '@/components/recipe/RecipeHeader';
import IngredientList from '@/components/recipe/IngredientList';
import StepList from '@/components/recipe/StepList';
import PriceDisplay from '@/components/recipe/PriceDisplay';
import { getRecipePricing } from '@/lib/services/pricing';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from('recipes')
    .select(
      'id, creator_id, title, description, media_url, thumbnail_url, cuisine, difficulty, prep_time, cook_time, calories, portions, price_chf, mines'
    )
    .eq('id', id)
    .single();

  if (error || !recipe) notFound();

  const { data: ingredients } = await supabase
    .from('recipe_ingredients')
    .select('id, ingredient_id, quantity, optional')
    .eq('recipe_id', id)
    .order('sort_order');

  // Fetch ingredient names separately
  const ingIds = (ingredients ?? []).map((i: any) => i.ingredient_id);
  const { data: ingData } = await supabase
    .from('ingredients')
    .select('id, name')
    .in('id', ingIds);
  const ingNameMap = new Map((ingData ?? []).map((i: any) => [i.id, i.name]));

  const { data: steps } = await supabase
    .from('recipe_steps')
    .select('id, step_number, instruction, duration_sec')
    .eq('recipe_id', id)
    .order('step_number');

  const ingredientIds = (ingredients ?? []).map((i: any) => i.ingredient_id);
  const pricing = ingredientIds.length > 0
    ? await getRecipePricing(ingredientIds)
    : null;

  const feedItem = {
    id: recipe.id,
    creatorId: recipe.creator_id,
    cuisine: recipe.cuisine,
    mediaUrl: recipe.media_url,
    thumbnailUrl: recipe.thumbnail_url,
    caption: recipe.description,
    mines: recipe.mines ?? 0,
    priceChf: recipe.price_chf,
    title: recipe.title,
    difficulty: recipe.difficulty,
    prepTime: recipe.prep_time,
    totalTime: (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0),
    calories: recipe.calories,
    portions: recipe.portions,
  };

  const ingredientList = (ingredients ?? []).map((i: any) => ({
    id: i.id,
    name: ingNameMap.get(i.ingredient_id) ?? 'Inconnu',
    quantity: i.quantity ?? '',
    optional: i.optional ?? false,
  }));

  const stepList = (steps ?? []).map((s: any) => ({
    id: s.id,
    stepNumber: s.step_number,
    instruction: s.instruction,
    durationSec: s.duration_sec,
  }));

  return (
    <div className="pb-8">
      <RecipeHeader recipe={feedItem} />

      <div className="space-y-6 px-4 pt-5">
        {recipe.description && (
          <p className="text-sm text-gray-600">{recipe.description}</p>
        )}

        <PriceDisplay pricing={pricing} />

        <section>
          <h2 className="mb-3 text-base font-semibold">Ingrédients</h2>
          <IngredientList ingredients={ingredientList} />
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">Préparation</h2>
          <StepList steps={stepList} />
        </section>
      </div>
    </div>
  );
}