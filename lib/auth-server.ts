import { cookies } from 'next/headers';

const FASTAPI_URL = process.env.FASTAPI_INTERNAL_URL || 'http://localhost:8000';

export async function getServerSideUser() {
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
      cache: 'no-store', // Don't cache auth requests
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Server auth check failed:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerSideUser();
  return !!user;
}