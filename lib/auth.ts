import { cookies } from 'next/headers';
import { User } from './types';

const FASTAPI_URL = process.env.FASTAPI_INTERNAL_URL || 'http://localhost:8000';

export async function getServerSideUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
      return null;
    }

    const response = await fetch(`${FASTAPI_URL}/api/v1/auth/me`, {
      headers: {
        'Cookie': cookieHeader,
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching server-side user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getServerSideUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

export async function getOptionalAuth(): Promise<User | null> {
  return getServerSideUser();
}