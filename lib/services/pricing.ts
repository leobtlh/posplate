// Interface du fournisseur de prix
// Cette abstraction permet d'ajouter facilement Coop, Migros, Denner, etc.

export interface PriceResult {
  store: 'coop' | 'migros';
  ingredientName: string;
  priceChf: number;
  unit: string;
  quantity: string;
}

export interface RecipePricing {
  totalCoop: number | null;
  totalMigros: number | null;
  cheapestStore: 'coop' | 'migros' | null;
  savings: number | null;
  items: PriceResult[];
}

export async function getRecipePricing(
  ingredientIds: string[]
): Promise<RecipePricing> {
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();

  const { data, error } = await supabase
    .from('prices')
    .select('store, price_chf, unit, quantity, ingredient_id')
    .in('ingredient_id', ingredientIds);

  if (error || !data) {
    return {
      totalCoop: null,
      totalMigros: null,
      cheapestStore: null,
      savings: null,
      items: [],
    };
  }

  // Get ingredient names separately
  const { data: ingData } = await supabase
    .from('ingredients')
    .select('id, name')
    .in('id', ingredientIds);

  const nameMap = new Map<string, string>();
  for (const ing of ingData ?? []) {
    nameMap.set(ing.id, ing.name);
  }

  const items: PriceResult[] = data.map((row: any) => ({
    store: row.store,
    ingredientName: nameMap.get(row.ingredient_id) ?? 'Inconnu',
    priceChf: Number(row.price_chf),
    unit: row.unit ?? '',
    quantity: row.quantity ?? '',
  }));

  const coopItems = items.filter((i) => i.store === 'coop');
  const migrosItems = items.filter((i) => i.store === 'migros');

  const totalCoop = coopItems.length > 0
    ? coopItems.reduce((sum, i) => sum + i.priceChf, 0)
    : null;
  const totalMigros = migrosItems.length > 0
    ? migrosItems.reduce((sum, i) => sum + i.priceChf, 0)
    : null;

  let cheapestStore: 'coop' | 'migros' | null = null;
  let savings: number | null = null;

  if (totalCoop !== null && totalMigros !== null && totalCoop !== totalMigros) {
    if (totalCoop < totalMigros) {
      cheapestStore = 'coop';
      savings = Number((totalMigros - totalCoop).toFixed(2));
    } else {
      cheapestStore = 'migros';
      savings = Number((totalCoop - totalMigros).toFixed(2));
    }
  }

  return { totalCoop, totalMigros, cheapestStore, savings, items };
}