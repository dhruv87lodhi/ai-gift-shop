import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { productName, category, keywords } = await request.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const prompt = `You are a product description writer for an Indian gift shop called Giftora. Write a compelling, SEO-friendly product description for the following gift product.

Product Name: ${productName || 'Gift Item'}
Category: ${category || 'General'}
Keywords: ${keywords || 'gift, present, special'}

Requirements:
- Write 2-3 short paragraphs (total ~80-120 words)
- Use warm, inviting tone perfect for a gift shop
- Highlight why this makes a great gift
- Include emotional appeal
- Mention quality and craftsmanship
- End with a call to action
- Use Indian context where appropriate (₹, festivals, etc.)

Return ONLY the description text, no headers or labels.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await res.json();
    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ description: description.trim() });
  } catch (error) {
    console.error('Describe product error:', error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
