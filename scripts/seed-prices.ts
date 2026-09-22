// Script de seed : 30 ingrédients avec prix Coop/Migros
// Usage : npx ts-node scripts/seed-prices.ts

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function seed() {
  console.log('🌱 Seed des ingrédients et prix...');

  const ingredients = [
    { name: 'Farine', category: 'féculents', emoji: '🌾' },
    { name: 'Sucre', category: 'épicerie', emoji: '🍚' },
    { name: 'Sel', category: 'épicerie', emoji: '🧂' },
    { name: 'Huile d\'olive', category: 'huiles', emoji: '🫒' },
    { name: 'Œufs', category: 'produits laitiers', emoji: '🥚' },
    { name: 'Beurre', category: 'produits laitiers', emoji: '🧈' },
    { name: 'Lait', category: 'produits laitiers', emoji: '🥛' },
    { name: 'Pâtes', category: 'féculents', emoji: '🍝' },
    { name: 'Riz', category: 'féculents', emoji: '🍚' },
    { name: 'Tomates', category: 'légumes', emoji: '🍅' },
    { name: 'Oignons', category: 'légumes', emoji: '🧅' },
    { name: 'Ail', category: 'légumes', emoji: '🧄' },
    { name: 'Poulet', category: 'viandes', emoji: '🍗' },
    { name: 'Bœuf', category: 'viandes', emoji: '🥩' },
    { name: 'Pommes de terre', category: 'légumes', emoji: '🥔' },
    { name: 'Carottes', category: 'légumes', emoji: '🥕' },
    { name: 'Fromage râpé', category: 'produits laitiers', emoji: '🧀' },
    { name: 'Crème liquide', category: 'produits laitiers', emoji: '🥛' },
    { name: 'Levure chimique', category: 'épicerie', emoji: '🧁' },
    { name: 'Chocolat noir', category: 'épicerie', emoji: '🍫' },
    { name: 'Poivre', category: 'épices', emoji: '🌶️' },
    { name: 'Paprika', category: 'épices', emoji: '🌶️' },
    { name: 'Curcuma', category: 'épices', emoji: '🟡' },
    { name: 'Cumin', category: 'épices', emoji: '🟤' },
    { name: 'Cannelle', category: 'épices', emoji: '🟫' },
    { name: 'Lentilles', category: 'légumineuses', emoji: '🫘' },
    { name: 'Pois chiches', category: 'légumineuses', emoji: '🫘' },
    { name: 'Courgettes', category: 'légumes', emoji: '🥒' },
    { name: 'Poivrons', category: 'légumes', emoji: '🫑' },
    { name: 'Champignons', category: 'légumes', emoji: '🍄' },
  ];

  const pricesCoop = [
    { price: 1.95, unit: 'kg', quantity: '1kg' },
    { price: 1.85, unit: 'kg', quantity: '1kg' },
    { price: 0.95, unit: 'kg', quantity: '1kg' },
    { price: 8.95, unit: 'L', quantity: '750ml' },
    { price: 4.80, unit: 'pièce', quantity: '6 pièces' },
    { price: 2.50, unit: 'kg', quantity: '250g' },
    { price: 1.55, unit: 'L', quantity: '1L' },
    { price: 1.45, unit: 'kg', quantity: '500g' },
    { price: 2.30, unit: 'kg', quantity: '1kg' },
    { price: 3.95, unit: 'kg', quantity: '1kg' },
    { price: 1.25, unit: 'kg', quantity: '1kg' },
    { price: 1.20, unit: 'kg', quantity: 'tête' },
    { price: 11.95, unit: 'kg', quantity: '1kg' },
    { price: 18.95, unit: 'kg', quantity: '1kg' },
    { price: 2.40, unit: 'kg', quantity: '2kg' },
    { price: 1.50, unit: 'kg', quantity: '1kg' },
    { price: 9.95, unit: 'kg', quantity: '300g' },
    { price: 2.95, unit: 'L', quantity: '250ml' },
    { price: 1.20, unit: 'kg', quantity: '1 sachet' },
    { price: 4.50, unit: 'kg', quantity: '100g' },
    { price: 2.50, unit: 'kg', quantity: '50g' },
    { price: 2.80, unit: 'kg', quantity: '50g' },
    { price: 3.20, unit: 'kg', quantity: '40g' },
    { price: 2.90, unit: 'kg', quantity: '50g' },
    { price: 3.50, unit: 'kg', quantity: '30g' },
    { price: 2.95, unit: 'kg', quantity: '500g' },
    { price: 3.50, unit: 'kg', quantity: '400g' },
    { price: 2.80, unit: 'kg', quantity: '1kg' },
    { price: 3.20, unit: 'kg', quantity: '1kg' },
    { price: 3.30, unit: 'kg', quantity: '250g' },
  ];

  const pricesMigros = [
    { price: 1.75, unit: 'kg', quantity: '1kg' },
    { price: 1.65, unit: 'kg', quantity: '1kg' },
    { price: 0.85, unit: 'kg', quantity: '1kg' },
    { price: 7.95, unit: 'L', quantity: '750ml' },
    { price: 4.50, unit: 'pièce', quantity: '6 pièces' },
    { price: 2.20, unit: 'kg', quantity: '250g' },
    { price: 1.45, unit: 'L', quantity: '1L' },
    { price: 1.25, unit: 'kg', quantity: '500g' },
    { price: 2.10, unit: 'kg', quantity: '1kg' },
    { price: 3.45, unit: 'kg', quantity: '1kg' },
    { price: 1.15, unit: 'kg', quantity: '1kg' },
    { price: 1.00, unit: 'kg', quantity: 'tête' },
    { price: 10.95, unit: 'kg', quantity: '1kg' },
    { price: 16.95, unit: 'kg', quantity: '1kg' },
    { price: 2.20, unit: 'kg', quantity: '2kg' },
    { price: 1.30, unit: 'kg', quantity: '1kg' },
    { price: 8.95, unit: 'kg', quantity: '300g' },
    { price: 2.75, unit: 'L', quantity: '250ml' },
    { price: 1.00, unit: 'kg', quantity: '1 sachet' },
    { price: 4.20, unit: 'kg', quantity: '100g' },
    { price: 2.20, unit: 'kg', quantity: '50g' },
    { price: 2.50, unit: 'kg', quantity: '50g' },
    { price: 2.80, unit: 'kg', quantity: '40g' },
    { price: 2.50, unit: 'kg', quantity: '50g' },
    { price: 3.20, unit: 'kg', quantity: '30g' },
    { price: 2.65, unit: 'kg', quantity: '500g' },
    { price: 3.20, unit: 'kg', quantity: '400g' },
    { price: 2.50, unit: 'kg', quantity: '1kg' },
    { price: 2.80, unit: 'kg', quantity: '1kg' },
    { price: 2.90, unit: 'kg', quantity: '250g' },
  ];

  const supabase = await import('@supabase/supabase-js').then(m =>
    m.createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  );

  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i];

    const { data: inserted } = await supabase
      .from('ingredients')
      .upsert({ name: ing.name, category: ing.category, emoji: ing.emoji })
      .select('id')
      .single();

    if (!inserted) continue;

    // Coop
    await supabase.from('prices').upsert({
      ingredient_id: inserted.id,
      store: 'coop',
      price_chf: pricesCoop[i].price,
      unit: pricesCoop[i].unit,
      quantity: pricesCoop[i].quantity,
    });

    // Migros
    await supabase.from('prices').upsert({
      ingredient_id: inserted.id,
      store: 'migros',
      price_chf: pricesMigros[i].price,
      unit: pricesMigros[i].unit,
      quantity: pricesMigros[i].quantity,
    });

    console.log(`  ✓ ${ing.name}`);
  }

  console.log('✅ Seed terminé : 30 ingrédients avec prix');
}

seed().catch(console.error);