import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function POST(req) {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const orderData = await req.json();

    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        $push: {
          orders: {
            ...orderData,
            date: new Date(),
            status: 'Processing',
          }
        },
        $set: { cart: [] } // Clear cart in DB
      },
      { new: true }
    );

    return NextResponse.json({ message: 'Order recorded', orders: user.orders });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
