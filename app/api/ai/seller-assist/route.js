import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query, context } = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/seller-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query, context: context || 'Gift shop seller on Giftora platform' }),
    });

    if (!res.ok) {
      throw new Error(`Python API responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error('Seller assist error:', error);
    return NextResponse.json({ error: 'Failed to get AI assistance' }, { status: 500 });
  }
}
