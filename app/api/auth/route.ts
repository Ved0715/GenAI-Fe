import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_URL = process.env.FASTAPI_INTERNAL_URL || 'http://localhost:8000';
const FASTAPI_AUTH_BASE = `${FASTAPI_URL}/api/v1/auth`;

async function forwardToFastAPI(
  endpoint: string,
  method: 'GET' | 'POST',
  request: NextRequest,
  body?: unknown
) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const authHeader = request.headers.get('authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const config: Record<string, unknown> = {
      method,
      url: `${FASTAPI_AUTH_BASE}${endpoint}`,
      headers,
      withCredentials: true,
    };

    if (body) {
      config.data = body;
    }

    const response = await axios(config);

    const nextResponse = NextResponse.json(response.data, { status: response.status });

    // Forward cookies from FastAPI response
    const setCookieHeaders = response.headers['set-cookie'];
    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie: string) => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });
    }

    return nextResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (!action) {
    return NextResponse.json({ detail: 'Action parameter required' }, { status: 400 });
  }

  const body = await request.json();

  switch (action) {
    case 'login':
      return forwardToFastAPI('/login', 'POST', request, body);

    case 'register':
      return forwardToFastAPI('/register', 'POST', request, body);

    case 'refresh':
      return forwardToFastAPI('/refresh', 'POST', request);

    case 'logout':
      return forwardToFastAPI('/logout', 'POST', request);

    case 'logout-all':
      return forwardToFastAPI('/logout-all', 'POST', request);

    default:
      return NextResponse.json({ detail: 'Invalid action' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'me') {
    return forwardToFastAPI('/me', 'GET', request);
  }

  return NextResponse.json({ detail: 'Invalid action' }, { status: 400 });
}