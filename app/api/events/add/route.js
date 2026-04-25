import { NextResponse } from 'next/server';
import { addEvent } from '@/lib/eventsDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, relation, date, type } = body;

    if (!userId || !name || !relation || !date || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newEvent = {
      id: Date.now().toString(),
      userId,
      name,
      relation,
      date, // "MM-DD"
      type,
    };

    addEvent(newEvent);

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add event' },
      { status: 500 }
    );
  }
}
