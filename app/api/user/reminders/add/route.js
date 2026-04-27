import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, occasion, date, relationship } = await request.json();

    if (!name || !occasion || !date || !relationship) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add new reminder to the array
    user.giftReminders.push({
      name,
      occasion,
      date: new Date(date),
      relationship
    });

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Reminder added successfully',
      reminders: user.giftReminders 
    }, { status: 201 });

  } catch (error) {
    console.error('Add reminder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
