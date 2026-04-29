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
    const { cart, giftNote } = await req.json();

    const updateData = { cart };
    if (giftNote !== undefined) {
      updateData.giftNote = giftNote;
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      updateData,
      { returnDocument: 'after' }
    );

    return NextResponse.json({ message: 'Cart synced', cart: user.cart, giftNote: user.giftNote });
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId).select('cart giftNote');

    return NextResponse.json({ cart: user.cart, giftNote: user.giftNote });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
