import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const envUsername = (process.env.SUPER_ADMIN_USERNAME || 'admin').trim();
    const envPassword = (process.env.SUPER_ADMIN_PASSWORD || 'admin').trim();

    if (username === envUsername && password === envPassword) {
      // Set secure cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'super_admin_session',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return NextResponse.json({ success: true, message: 'Logged in' });
    }

    return NextResponse.json(
      { success: false, message: 'Username atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
