import { NextResponse } from 'next/server';

// This is a stub API for product CRUD operations
// In production, this would interact with MongoDB

export async function GET() {
  return NextResponse.json({ products: [], message: 'Use client-side localStorage for demo' });
}

export async function POST(request) {
  try {
    const product = await request.json();
    return NextResponse.json({ success: true, product, message: 'Product saved to localStorage' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...updates } = await request.json();
    return NextResponse.json({ success: true, id, updates });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
