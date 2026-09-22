import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Texte requis' }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Clé API OpenRouter manquante' }, { status: 500 });
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://posplate.app',
        'X-Title': 'Posplate',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4.1-flash',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant culinaire. Extrais les informations d'une recette depuis du texte libre.
Réponds UNIQUEMENT avec un objet JSON valide contenant :
- title (string, requis)
- description (string)
- cuisine (string, une seule : italienne, française, asiatique, suisse, mexicaine, indienne, orientale, autre)
- difficulty (string: facile, moyen, difficile)
- prep_time (number, minutes)
- cook_time (number, minutes)
- calories (number)
- portions (number)

Si une info n'est pas dans le texte, mets null.`,
          },
          { role: 'user', content: text },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? `Erreur OpenRouter (${response.status})` },
        { status: 500 }
      );
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'Réponse IA vide' }, { status: 500 });
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Pas de JSON dans la réponse' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Erreur IA' },
      { status: 500 }
    );
  }
}