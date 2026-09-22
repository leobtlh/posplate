/**
 * Client Gorse — moteur de recommandation open-source (Apache 2.0, gratuit).
 *
 * Pourquoi Gorse plutôt que Monolith (ByteDance) :
 *  - Monolith (C++/TensorFlow) est conçu pour des milliards d'événements et des clusters GPU.
 *    Trop lourd pour démarrer, pertinent seulement à très grande échelle.
 *  - Gorse est un service autonome en Go (binaire unique / Docker), gratuit, open-source,
 *    avec API REST et recommandation collaborative "out of the box".
 *  - Il gère nativement les feedbacks : "mines" = feedback positif, "view" = implicite.
 *
 * Docs : https://gorse.io
 * Repo : https://github.com/gorse-io/gorse
 *
 * Variables d'env (.env.local) :
 *   GORSE_URL=http://localhost:8088
 *   GORSE_API_KEY=...   (optionnel si l'auth est désactivée en dev)
 */

const GORSE_URL = process.env.GORSE_URL ?? 'http://localhost:8088';
const GORSE_API_KEY = process.env.GORSE_API_KEY ?? '';

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (GORSE_API_KEY) h['X-API-Key'] = GORSE_API_KEY;
  return h;
}

// ---------------------------------------------------------------------------
// Types Gorse (format attendu par l'API REST)
// ---------------------------------------------------------------------------

export type GorseUser = {
  UserId: string;
  Labels?: string[];
  Comment?: string;
};

export type GorseItem = {
  ItemId: string;
  IsHidden?: boolean;
  Labels?: string[];
  Categories?: string[];
  Timestamp?: string; // ISO 8601
  Comment?: string;
};

/**
 * Feedback : c'est ici qu'on envoie les "mines" et les vues.
 *  - FeedbackType "mine" : feedback explicite positif (pondéré fort)
 *  - FeedbackType "view" : feedback implicite (pondéré faible)
 */
export type GorseFeedback = {
  FeedbackType: string;
  UserId: string;
  ItemId: string;
  Timestamp: string; // ISO 8601
  Value?: number;
};

export type GorseRecommendation = {
  Id: string;
  Score: number;
};

// ---------------------------------------------------------------------------
// API bas niveau
// ---------------------------------------------------------------------------

async function gorseFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${GORSE_URL}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Gorse ${res.status} sur ${path} : ${body}`);
  }
  return res;
}

// ---------------------------------------------------------------------------
// Synchronisation des données (users, items, feedbacks)
// ---------------------------------------------------------------------------

/** Insère ou met à jour un utilisateur. */
export async function upsertUser(user: GorseUser): Promise<void> {
  await gorseFetch('/api/user', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

/** Insère ou met à jour une recette (item). */
export async function upsertItem(item: GorseItem): Promise<void> {
  await gorseFetch('/api/item', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

/** Envoie un lot de feedbacks (mines, vues, etc.). */
export async function insertFeedback(
  feedbacks: GorseFeedback[]
): Promise<void> {
  if (feedbacks.length === 0) return;
  await gorseFetch('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(feedbacks),
  });
}

// ---------------------------------------------------------------------------
// Recommandations
// ---------------------------------------------------------------------------

/**
 * Récupère les recommandations personnalisées pour un utilisateur.
 *
 * @param userId  Identifiant Supabase de l'utilisateur
 * @param n       Nombre d'items à retourner
 * @param categories  Filtres optionnels (ex: ["vegan", "sans-gluten"])
 */
export async function getRecommendations(
  userId: string,
  n = 20,
  categories?: string[]
): Promise<GorseRecommendation[]> {
  const params = new URLSearchParams({ n: String(n) });
  if (categories && categories.length > 0) {
    params.set('categories', categories.join(','));
  }

  const res = await gorseFetch(
    `/api/recommend/${encodeURIComponent(userId)}?${params.toString()}`,
    { method: 'GET' }
  );

  return (await res.json()) as GorseRecommendation[];
}

/**
 * Recommandations "item-to-item" : recettes similaires à une recette donnée.
 * Utile pour la page détail d'une recette ("Tu aimeras aussi...").
 */
export async function getSimilarItems(
  itemId: string,
  n = 10
): Promise<GorseRecommendation[]> {
  const res = await gorseFetch(
    `/api/item/${encodeURIComponent(itemId)}/neighbors?n=${n}`,
    { method: 'GET' }
  );
  return (await res.json()) as GorseRecommendation[];
}
