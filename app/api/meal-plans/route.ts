import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const weekStart = searchParams.get('week_start');
  const householdId = searchParams.get('household_id');

  let query = supabase
    .from('meal_plans')
    .select('id, recipe_id, plan_date, meal_type, servings, notes')
    .eq('user_id', user.id);

  if (weekStart) {
    const end = getEndOfWeek(weekStart);
    query = query.gte('plan_date', weekStart).lte('plan_date', end);
  }
  if (householdId) query = query.eq('household_id', householdId);
  else query = query.is('household_id', null);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const body = await request.json();
  const { recipe_id, plan_date, meal_type, household_id } = body;

  if (!recipe_id || !plan_date || !meal_type) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('meal_plans')
    .insert({
      user_id: user.id,
      recipe_id,
      plan_date,
      meal_type,
      household_id: household_id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  const { error } = await supabase
    .from('meal_plans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

function getEndOfWeek(start: string): string {
  const d = new Date(start);
  d.setDate(d.getDate() + 6);
  return d.toISOString().split('T')[0];
}