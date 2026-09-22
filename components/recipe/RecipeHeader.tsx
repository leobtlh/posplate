import { Clock, ChefHat, Flame, Users } from 'lucide-react';
import type { FeedItem } from '@/lib/services/recipes';

interface RecipeHeaderProps {
  recipe: FeedItem;
}

export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <div className="relative">
      {recipe.mediaUrl ? (
        <img
          src={recipe.mediaUrl}
          alt={recipe.title}
          className="h-56 w-full object-cover"
        />
      ) : (
        <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
          <span className="text-5xl font-bold text-white">{recipe.title[0]}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-4 left-4 right-4">
        <h1 className="text-2xl font-bold text-white drop-shadow-sm">
          {recipe.title}
        </h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/90">
          {recipe.totalTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {recipe.totalTime} min
            </span>
          )}
          {recipe.difficulty && (
            <span className="flex items-center gap-1">
              <ChefHat className="h-3.5 w-3.5" /> {recipe.difficulty}
            </span>
          )}
          {recipe.calories && (
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" /> {recipe.calories} kcal
            </span>
          )}
          {recipe.portions && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {recipe.portions} pers.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}