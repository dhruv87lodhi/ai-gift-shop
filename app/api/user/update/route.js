import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req) {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { name, phone } = await req.json();

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { name, phone },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    return NextResponse.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
