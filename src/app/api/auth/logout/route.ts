import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, invalidateSession } from '@/server/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (token) {
      const payload = await verifySessionToken(token);
      if (payload) {
        await invalidateSession(payload.sessionId);
      }
    }

    cookieStore.delete('auth-token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}