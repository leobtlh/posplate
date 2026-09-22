/**
 * Envoie les feedbacks utilisateur à Gorse.
 *
 * Appelé par le front quand :
 *  - l'utilisateur met une "mine"  -> FeedbackType "mine" (positif explicite)
 *  - l'utilisateur regarde une vidéo -> FeedbackType "view" (implicite)
 *  - l'utilisateur sauvegarde un plat -> FeedbackType "save" (positif fort)
 *
 * On passe par une route serveur pour :
 *  1. ne pas exposer la clé Gorse au client,
 *  2. vérifier que l'utilisateur est bien authentifié (Supabase),
 *  3. empêcher un client de forger du feedback pour un autre utilisateur.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { insertFeedback, GorseFeedback } from '@/lib/feed/gorse';

type Body = {
  itemId: string;
  type: 'mine' | 'view' | 'save';
  value?: number;
};

// Pondération des feedbacks côté Gorse (explicite = plus fort)
const FEEDBACK_VALUES: Record<Body['type'], number> = {
  mine: 1.0,
  save: 1.5,
  view: 0.2,
};

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') ?? '';
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 });
  }

  if (!body.itemId || !body.type) {
    return NextResponse.json(
      { error: 'itemId et type sont requis' },
      { status: 400 }
    );
  }

  const feedback: GorseFeedback = {
    FeedbackType: body.type,
    UserId: user.id,
    ItemId: body.itemId,
    Timestamp: new Date().toISOString(),
    Value: body.value ?? FEEDBACK_VALUES[body.type] ?? 1.0,
  };

  try {
    await insertFeedback([feedback]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Erreur Gorse' },
      { status: 502 }
    );
  }
}
