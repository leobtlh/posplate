export interface PriceItem {
  ingredientName: string;
  store: 'coop' | 'migros';
  priceChf: number;
  unit: string;
  quantity: string;
}

export interface PriceComparison {
  ingredientName: string;
  coop: PriceItem | null;
  migros: PriceItem | null;
  cheapest: PriceItem | null;
  savingsChf: number | null;
}