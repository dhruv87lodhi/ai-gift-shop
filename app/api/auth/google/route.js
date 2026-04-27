import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    await dbConnect();
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: 'Missing Google credential' }, { status: 400 });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return NextResponse.json({ error: 'Email not provided by Google' }, { status: 400 });
    }

    // Find or create user
    let user = await User.findOne({ 
      $or: [{ googleId }, { email }] 
    });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        profileImage: picture || '',
        // Password is not required for Google users as per model update
      });
    } else if (!user.googleId) {
      // Link existing email-based account to Google
      user.googleId = googleId;
      if (!user.profileImage && picture) user.profileImage = picture;
      await user.save();
    }

    // Generate JWT token
    const token = await signToken({ userId: user._id.toString(), email: user.email });
    
    // Set authentication cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Signed in with Google successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Google Sign-in error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
