import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cuisine = searchParams.get('cuisine');
  const q = searchParams.get('q');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  const supabase = await createClient();

  let query = supabase
    .from('recipes')
    .select(
      'id, title, description, media_url, thumbnail_url, cuisine, difficulty, prep_time, cook_time, calories, portions, price_chf, mines, creator_id'
    )
    .order('mines', { ascending: false })
    .limit(limit);

  if (cuisine) {
    query = query.eq('cuisine', cuisine);
  }

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}