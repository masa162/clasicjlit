/**
 * Middleware for Basic Authentication on Admin Routes
 * 
 * Protects /admin routes with Basic Authentication.
 * Credentials are configured via environment variables:
 * - BASIC_AUTH_USER
 * - BASIC_AUTH_PASS
 */

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(req: NextRequest) {
  // Only apply to admin routes
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip authentication in development if no credentials are set
  if (process.env.NODE_ENV === 'development') {
    const authUser = process.env.BASIC_AUTH_USER;
    const authPass = process.env.BASIC_AUTH_PASS;
    
    if (!authUser || !authPass) {
      console.warn('⚠️  Basic Auth credentials not set. Skipping authentication in development mode.');
      return NextResponse.next();
    }
  }

  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return createAuthResponse();
    }

    // Decode and parse credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');

    // Verify credentials
    const expectedUser = process.env.BASIC_AUTH_USER;
    const expectedPass = process.env.BASIC_AUTH_PASS;

    if (!expectedUser || !expectedPass) {
      console.error('❌ Basic Auth credentials not configured in environment variables');
      return new NextResponse('Authentication not configured', { status: 500 });
    }

    // Constant-time comparison to prevent timing attacks
    const userMatch = constantTimeCompare(username, expectedUser);
    const passMatch = constantTimeCompare(password, expectedPass);

    if (userMatch && passMatch) {
      return NextResponse.next();
    }

    // Invalid credentials
    return createAuthResponse('Invalid credentials');
  } catch (error) {
    console.error('Authentication error:', error);
    return createAuthResponse('Authentication error');
  }
}

/**
 * Create an authentication required response
 */
function createAuthResponse(message: string = 'Authentication required'): NextResponse {
  return new NextResponse(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area - Inishie no Ne", charset="UTF-8"',
    },
  });
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}
