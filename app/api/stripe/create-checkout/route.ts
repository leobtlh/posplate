import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia' as const,
  });
}

export async function POST(request: NextRequest) {
  const { priceId, userId } = await request.json();

  if (!priceId || !userId) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      success_url: `${request.headers.get('origin')}/profil?premium=success`,
      cancel_url: `${request.headers.get('origin')}/profil?premium=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Erreur Stripe' },
      { status: 500 }
    );
  }
}