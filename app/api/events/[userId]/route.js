import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/eventsDb';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const allEvents = getEvents();
    const userEvents = allEvents.filter(event => event.userId === userId);

    return NextResponse.json({ success: true, events: userEvents }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
