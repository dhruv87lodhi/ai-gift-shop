import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(request) {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reminderId = searchParams.get('id');

    if (!reminderId) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Filter out the reminder to delete
    const originalLength = user.giftReminders.length;
    user.giftReminders = user.giftReminders.filter(
      r => r._id.toString() !== reminderId
    );

    if (user.giftReminders.length === originalLength) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Reminder deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete reminder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
