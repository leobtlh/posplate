// Script de seed : 30 recettes d'exemple avec placeholders visuels
// Usage : npx tsx scripts/seed-recipes.ts

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Couleurs par type de cuisine pour les placeholders
const cuisineColors: Record<string, string> = {
  italienne: '8FC809',
  asiatique: 'E74C3C',
  française: '2C3E50',
  suisse: 'F39C12',
  mexicaine: 'E67E22',
  indienne: '9B59B6',
  orientale: '1ABC9C',
  autre: '3498DB',
};

const cuisineEmojis: Record<string, string> = {
  italienne: '🍝',
  asiatique: '🍜',
  française: '🥖',
  suisse: '🧀',
  mexicaine: '🌮',
  indienne: '🍛',
  orientale: '🧆',
  autre: '🥗',
};

// Génère une URL placeholder verticale (format TikTok 9:16)
function placeholderUrl(cuisine: string, title: string, emoji: string): string {
  const color = cuisineColors[cuisine] ?? '8FC809';
  return `https://placehold.co/400x711/${color}/FFFFFF?text=${encodeURIComponent(emoji + ' ' + title.slice(0, 12))}&font=raleway`;
}

const recipes = [
  // === ITALIENNE ===
  { title: 'Pâtes carbonara', description: 'Un classique italien crémeux', cuisine: 'italienne', difficulty: 'facile', prep_time: 10, cook_time: 15, calories: 550, portions: 2, price_chf: 8.50 },
  { title: 'Risotto aux champignons', description: 'Risotto crémeux au parmesan', cuisine: 'italienne', difficulty: 'moyen', prep_time: 15, cook_time: 30, calories: 480, portions: 2, price_chf: 12.00 },
  { title: 'Pizza margherita maison', description: 'La pizza napolitaine authentique', cuisine: 'italienne', difficulty: 'moyen', prep_time: 30, cook_time: 15, calories: 680, portions: 4, price_chf: 9.50 },
  { title: 'Tiramisu', description: 'Dessert italien iconique au café', cuisine: 'italienne', difficulty: 'facile', prep_time: 25, cook_time: 0, calories: 420, portions: 6, price_chf: 14.00 },
  // === ASIATIQUE ===
  { title: 'Poulet curry thaï', description: 'Curry parfumé au lait de coco', cuisine: 'asiatique', difficulty: 'moyen', prep_time: 15, cook_time: 25, calories: 520, portions: 3, price_chf: 15.50 },
  { title: 'Pad thaï', description: 'Nouilles sautées thaïlandaises', cuisine: 'asiatique', difficulty: 'moyen', prep_time: 20, cook_time: 10, calories: 480, portions: 2, price_chf: 11.00 },
  { title: 'Bœuf brocolis', description: 'Sauté de bœuf aux brocolis', cuisine: 'asiatique', difficulty: 'facile', prep_time: 10, cook_time: 10, calories: 400, portions: 2, price_chf: 16.00 },
  { title: 'Ramen maison', description: 'Bouillon tonkotsu authentique', cuisine: 'asiatique', difficulty: 'difficile', prep_time: 60, cook_time: 180, calories: 620, portions: 4, price_chf: 25.00 },
  // === FRANÇAISE ===
  { title: 'Quiche lorraine', description: 'Tarte salée aux lardons et à la crème', cuisine: 'française', difficulty: 'moyen', prep_time: 20, cook_time: 35, calories: 450, portions: 4, price_chf: 10.50 },
  { title: 'Bœuf bourguignon', description: 'Mijoté de bœuf au vin rouge', cuisine: 'française', difficulty: 'difficile', prep_time: 30, cook_time: 150, calories: 580, portions: 6, price_chf: 22.00 },
  { title: 'Croque-monsieur', description: 'Le sandwich chaud français gratiné', cuisine: 'française', difficulty: 'facile', prep_time: 5, cook_time: 10, calories: 380, portions: 1, price_chf: 5.50 },
  { title: 'Ratatouille', description: 'Légumes du soleil mijotés', cuisine: 'française', difficulty: 'moyen', prep_time: 20, cook_time: 45, calories: 220, portions: 4, price_chf: 8.00 },
  { title: 'Crêpes', description: 'Crêpes fines sucrées', cuisine: 'française', difficulty: 'facile', prep_time: 10, cook_time: 15, calories: 180, portions: 12, price_chf: 5.00 },
  { title: 'Soupe à l\'oignon', description: 'Soupe gratinée au gruyère', cuisine: 'française', difficulty: 'moyen', prep_time: 15, cook_time: 40, calories: 340, portions: 4, price_chf: 7.00 },
  // === SUISSE ===
  { title: 'Fondue moitié-moitié', description: 'La fondue suisse classique', cuisine: 'suisse', difficulty: 'facile', prep_time: 10, cook_time: 15, calories: 720, portions: 4, price_chf: 18.00 },
  { title: 'Rösti', description: 'Galettes de pommes de terre croustillantes', cuisine: 'suisse', difficulty: 'facile', prep_time: 15, cook_time: 20, calories: 350, portions: 2, price_chf: 6.50 },
  { title: 'Cordon bleu', description: 'Veau pané au fromage qui coule', cuisine: 'suisse', difficulty: 'moyen', prep_time: 15, cook_time: 15, calories: 580, portions: 2, price_chf: 14.00 },
  // === MEXICAINE ===
  { title: 'Tacos mexicains', description: 'Tacos au bœuf épicé', cuisine: 'mexicaine', difficulty: 'facile', prep_time: 15, cook_time: 10, calories: 450, portions: 4, price_chf: 14.50 },
  { title: 'Guacamole', description: 'Dip à l\'avocat frais', cuisine: 'mexicaine', difficulty: 'facile', prep_time: 10, cook_time: 0, calories: 180, portions: 4, price_chf: 5.00 },
  { title: 'Chili con carne', description: 'Haricots épicés au bœuf', cuisine: 'mexicaine', difficulty: 'moyen', prep_time: 15, cook_time: 45, calories: 520, portions: 4, price_chf: 12.00 },
  // === INDIENNE ===
  { title: 'Dhal de lentilles', description: 'Curry de lentilles indien réconfortant', cuisine: 'indienne', difficulty: 'facile', prep_time: 10, cook_time: 25, calories: 320, portions: 3, price_chf: 6.50 },
  { title: 'Poulet tikka masala', description: 'Poulet mariné sauce curry', cuisine: 'indienne', difficulty: 'moyen', prep_time: 30, cook_time: 25, calories: 490, portions: 4, price_chf: 16.00 },
  { title: 'Naan à l\'ail', description: 'Pain indien moelleux', cuisine: 'indienne', difficulty: 'moyen', prep_time: 60, cook_time: 10, calories: 260, portions: 6, price_chf: 4.50 },
  // === ORIENTALE ===
  { title: 'Falafel', description: 'Boulettes de pois chiches', cuisine: 'orientale', difficulty: 'moyen', prep_time: 20, cook_time: 15, calories: 280, portions: 4, price_chf: 8.00 },
  { title: 'Tajine de poulet', description: 'Mijoté marocain aux épices', cuisine: 'orientale', difficulty: 'moyen', prep_time: 20, cook_time: 60, calories: 480, portions: 4, price_chf: 15.00 },
  { title: 'Hummus', description: 'Purée de pois chiches à l\'huile d\'olive', cuisine: 'orientale', difficulty: 'facile', prep_time: 10, cook_time: 0, calories: 200, portions: 4, price_chf: 4.50 },
  // === AUTRE ===
  { title: 'Omelette soufflée', description: 'Omelette légère et aérienne', cuisine: 'autre', difficulty: 'facile', prep_time: 5, cook_time: 8, calories: 320, portions: 1, price_chf: 4.00 },
  { title: 'Salade César', description: 'Salade croquante au poulet', cuisine: 'autre', difficulty: 'facile', prep_time: 15, cook_time: 10, calories: 380, portions: 2, price_chf: 10.00 },
  { title: 'Buddha bowl', description: 'Bol complet et healthy', cuisine: 'autre', difficulty: 'facile', prep_time: 20, cook_time: 15, calories: 420, portions: 2, price_chf: 11.00 },
  { title: 'Brownies', description: 'Brownies au chocolat fondant', cuisine: 'autre', difficulty: 'facile', prep_time: 15, cook_time: 25, calories: 380, portions: 9, price_chf: 6.50 },
];

async function seed() {
  console.log('🌱 Seed des 30 recettes...');

  const supabase = await import('@supabase/supabase-js').then(m =>
    m.createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  );

  // On prend le premier utilisateur comme créateur par défaut
  const { data: users } = await supabase.from('profiles').select('id').limit(1);
  const creatorId = users?.[0]?.id;

  if (!creatorId) {
    console.error('❌ Aucun utilisateur trouvé. Crée d\'abord un compte.');
    process.exit(1);
  }

  for (const recipe of recipes) {
    const emoji = cuisineEmojis[recipe.cuisine] ?? '🍽️';
    const media_url = placeholderUrl(recipe.cuisine, recipe.title, emoji);

    const { error } = await supabase.from('recipes').insert({
      creator_id: creatorId,
      title: recipe.title,
      description: recipe.description,
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      calories: recipe.calories,
      portions: recipe.portions,
      price_chf: recipe.price_chf,
      media_url,
      thumbnail_url: media_url,
    });

    if (error) {
      console.error(`  ✗ ${recipe.title}: ${error.message}`);
    } else {
      console.log(`  ✓ ${recipe.title}`);
    }
  }

  console.log('✅ Seed terminé : 30 recettes insérées avec placeholders');
}

seed().catch(console.error);