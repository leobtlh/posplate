interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  optional: boolean;
}

interface IngredientListProps {
  ingredients: Ingredient[];
}

export default function IngredientList({ ingredients }: IngredientListProps) {
  if (!ingredients || ingredients.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">Aucun ingrédient listé</p>
    );
  }

  return (
    <ul className="space-y-2">
      {ingredients.map((ing) => (
        <li
          key={ing.id}
          className={`flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 ${
            ing.optional ? 'opacity-60' : ''
          }`}
        >
          <span className="text-sm text-gray-700">{ing.name}</span>
          <span className="text-sm font-medium text-gray-900">
            {ing.quantity}
          </span>
        </li>
      ))}
    </ul>
  );
}