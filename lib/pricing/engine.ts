export interface PriceItem {
  ingredientName: string;
  store: 'coop' | 'migros';
  priceChf: number;
  unit: string;
  quantity: string;
}

export type PriceProvider = {
  store: 'coop' | 'migros';
  getPrice: (ingredientName: string) => PriceItem | null;
  searchIngredients: (query: string) => PriceItem[];
};

// Données de prix suisses simulées (MVP)
// En production : API Coop / Migros

const COOP_PRICES: Record<string, PriceItem> = {
  'farine': { ingredientName: 'Farine', store: 'coop', priceChf: 1.95, unit: 'kg', quantity: '1kg' },
  'sucre': { ingredientName: 'Sucre', store: 'coop', priceChf: 1.85, unit: 'kg', quantity: '1kg' },
  'sel': { ingredientName: 'Sel', store: 'coop', priceChf: 0.95, unit: 'kg', quantity: '1kg' },
  'huile d\'olive': { ingredientName: 'Huile d\'olive', store: 'coop', priceChf: 8.95, unit: 'L', quantity: '750ml' },
  'oeufs': { ingredientName: 'Œufs', store: 'coop', priceChf: 4.80, unit: 'pièce', quantity: '6 pièces' },
  'beurre': { ingredientName: 'Beurre', store: 'coop', priceChf: 2.50, unit: 'kg', quantity: '250g' },
  'lait': { ingredientName: 'Lait', store: 'coop', priceChf: 1.55, unit: 'L', quantity: '1L' },
  'pâtes': { ingredientName: 'Pâtes', store: 'coop', priceChf: 1.45, unit: 'kg', quantity: '500g' },
  'riz': { ingredientName: 'Riz', store: 'coop', priceChf: 2.30, unit: 'kg', quantity: '1kg' },
  'tomates': { ingredientName: 'Tomates', store: 'coop', priceChf: 3.95, unit: 'kg', quantity: '1kg' },
  'oignons': { ingredientName: 'Oignons', store: 'coop', priceChf: 1.25, unit: 'kg', quantity: '1kg' },
  'ail': { ingredientName: 'Ail', store: 'coop', priceChf: 1.20, unit: 'kg', quantity: 'tête' },
  'poulet': { ingredientName: 'Poulet', store: 'coop', priceChf: 11.95, unit: 'kg', quantity: '1kg' },
  'boeuf': { ingredientName: 'Bœuf', store: 'coop', priceChf: 18.95, unit: 'kg', quantity: '1kg' },
  'pommes de terre': { ingredientName: 'Pommes de terre', store: 'coop', priceChf: 2.40, unit: 'kg', quantity: '2kg' },
  'carottes': { ingredientName: 'Carottes', store: 'coop', priceChf: 1.50, unit: 'kg', quantity: '1kg' },
  'fromage': { ingredientName: 'Fromage', store: 'coop', priceChf: 9.95, unit: 'kg', quantity: '300g' },
  'crème': { ingredientName: 'Crème', store: 'coop', priceChf: 2.95, unit: 'L', quantity: '250ml' },
  'levure': { ingredientName: 'Levure', store: 'coop', priceChf: 1.20, unit: 'kg', quantity: '1 sachet' },
  'chocolat': { ingredientName: 'Chocolat', store: 'coop', priceChf: 4.50, unit: 'kg', quantity: '100g' },
};

const MIGROS_PRICES: Record<string, PriceItem> = {
  'farine': { ingredientName: 'Farine', store: 'migros', priceChf: 1.75, unit: 'kg', quantity: '1kg' },
  'sucre': { ingredientName: 'Sucre', store: 'migros', priceChf: 1.65, unit: 'kg', quantity: '1kg' },
  'sel': { ingredientName: 'Sel', store: 'migros', priceChf: 0.85, unit: 'kg', quantity: '1kg' },
  'huile d\'olive': { ingredientName: 'Huile d\'olive', store: 'migros', priceChf: 7.95, unit: 'L', quantity: '750ml' },
  'oeufs': { ingredientName: 'Œufs', store: 'migros', priceChf: 4.50, unit: 'pièce', quantity: '6 pièces' },
  'beurre': { ingredientName: 'Beurre', store: 'migros', priceChf: 2.20, unit: 'kg', quantity: '250g' },
  'lait': { ingredientName: 'Lait', store: 'migros', priceChf: 1.45, unit: 'L', quantity: '1L' },
  'pâtes': { ingredientName: 'Pâtes', store: 'migros', priceChf: 1.25, unit: 'kg', quantity: '500g' },
  'riz': { ingredientName: 'Riz', store: 'migros', priceChf: 2.10, unit: 'kg', quantity: '1kg' },
  'tomates': { ingredientName: 'Tomates', store: 'migros', priceChf: 3.45, unit: 'kg', quantity: '1kg' },
  'oignons': { ingredientName: 'Oignons', store: 'migros', priceChf: 1.15, unit: 'kg', quantity: '1kg' },
  'ail': { ingredientName: 'Ail', store: 'migros', priceChf: 1.00, unit: 'kg', quantity: 'tête' },
  'poulet': { ingredientName: 'Poulet', store: 'migros', priceChf: 10.95, unit: 'kg', quantity: '1kg' },
  'boeuf': { ingredientName: 'Bœuf', store: 'migros', priceChf: 16.95, unit: 'kg', quantity: '1kg' },
  'pommes de terre': { ingredientName: 'Pommes de terre', store: 'migros', priceChf: 2.20, unit: 'kg', quantity: '2kg' },
  'carottes': { ingredientName: 'Carottes', store: 'migros', priceChf: 1.30, unit: 'kg', quantity: '1kg' },
  'fromage': { ingredientName: 'Fromage', store: 'migros', priceChf: 8.95, unit: 'kg', quantity: '300g' },
  'crème': { ingredientName: 'Crème', store: 'migros', priceChf: 2.75, unit: 'L', quantity: '250ml' },
  'levure': { ingredientName: 'Levure', store: 'migros', priceChf: 1.00, unit: 'kg', quantity: '1 sachet' },
  'chocolat': { ingredientName: 'Chocolat', store: 'migros', priceChf: 4.20, unit: 'kg', quantity: '100g' },
};

export function createCoopProvider(): PriceProvider {
  return {
    store: 'coop',
    getPrice(name: string) {
      return COOP_PRICES[name.toLowerCase()] ?? null;
    },
    searchIngredients(query: string) {
      const q = query.toLowerCase();
      return Object.values(COOP_PRICES).filter((p) =>
        p.ingredientName.toLowerCase().includes(q)
      );
    },
  };
}

export function createMigrosProvider(): PriceProvider {
  return {
    store: 'migros',
    getPrice(name: string) {
      return MIGROS_PRICES[name.toLowerCase()] ?? null;
    },
    searchIngredients(query: string) {
      const q = query.toLowerCase();
      return Object.values(MIGROS_PRICES).filter((p) =>
        p.ingredientName.toLowerCase().includes(q)
      );
    },
  };
}

export function getCheapestPrice(
  ingredientName: string
): { store: 'coop' | 'migros'; priceChf: number } | null {
  const coop = COOP_PRICES[ingredientName.toLowerCase()];
  const migros = MIGROS_PRICES[ingredientName.toLowerCase()];

  if (!coop && !migros) return null;
  if (!coop) return migros ? { store: 'migros', priceChf: migros.priceChf } : null;
  if (!migros) return { store: 'coop', priceChf: coop.priceChf };

  return coop.priceChf <= migros.priceChf
    ? { store: 'coop', priceChf: coop.priceChf }
    : { store: 'migros', priceChf: migros.priceChf };
}