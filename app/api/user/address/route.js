import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId).select('addresses');
    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const address = await req.json();
    
    const user = await User.findById(payload.userId);
    
    // If it's the first address or marked as default, unset others
    if (address.isDefault || user.addresses.length === 0) {
      user.addresses.forEach(a => a.isDefault = false);
      address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();

    return NextResponse.json({ message: 'Address added', addresses: user.addresses });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { addressId, isDefault, ...updates } = await req.json();
    
    const user = await User.findById(payload.userId);
    const address = user.addresses.id(addressId);
    
    if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 });

    if (isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
      address.isDefault = true;
    }

    Object.assign(address, updates);
    await user.save();

    return NextResponse.json({ message: 'Address updated', addresses: user.addresses });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('id');

    await dbConnect();
    const user = await User.findById(payload.userId);
    user.addresses.pull({ _id: addressId });
    await user.save();

    return NextResponse.json({ message: 'Address removed', addresses: user.addresses });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
