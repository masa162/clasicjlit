/**
 * Cloudflare D1 Database Client
 * 
 * This module provides access to the Cloudflare D1 database.
 * In production (Cloudflare Pages), bindings are available via getRequestContext().
 * In development, you need to use wrangler for local bindings.
 */

import { D1Database } from '@cloudflare/workers-types';

/**
 * Get the D1 database instance from the current request context
 * This should be called within API routes or server components
 * 
 * @throws Error if database binding is not available
 */
export function getD1(): D1Database {
  // For Cloudflare Pages - check cloudflare context
  if (typeof globalThis !== 'undefined' && 'cloudflare' in globalThis) {
    const env = (globalThis as any).cloudflare.env;
    if (env?.DB) {
      return env.DB as D1Database;
    }
  }

  // For local development with wrangler
  if (process.env.DB) {
    return process.env.DB as unknown as D1Database;
  }

  // Return a mock database for build time (will be replaced at runtime)
  // This prevents build errors while still throwing at runtime if misconfigured
  if (process.env.NODE_ENV !== 'production' && !process.env.DB) {
    console.warn(
      '⚠️  D1 Database binding not found during build. ' +
      'This is expected during `next build`. ' +
      'Make sure to run with `wrangler pages dev` for development.'
    );
    // Return a mock that will throw if actually used
    return createMockD1();
  }

  throw new Error(
    'D1 Database binding not found. ' +
    'Make sure you are running with `wrangler pages dev` in development, ' +
    'or that your Cloudflare Pages deployment has the DB binding configured. ' +
    'Standard `npm run dev` will not work with D1/R2 bindings.'
  );
}

/**
 * Create a mock D1 database for build time
 */
function createMockD1(): D1Database {
  const throwError = () => {
    throw new Error('D1 Database binding not configured. This is a build-time mock.');
  };

  return {
    prepare: () => ({
      bind: () => ({
        all: throwError,
        first: throwError,
        run: throwError,
        raw: throwError,
      }),
      all: throwError,
      first: throwError,
      run: throwError,
      raw: throwError,
    }),
    dump: throwError,
    batch: throwError,
    exec: throwError,
  } as any;
}

/**
 * Utility function to execute a prepared statement
 * Includes error handling and logging
 */
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<{ results: T[]; success: boolean; error?: string }> {
  try {
    const db = getD1();
    const stmt = db.prepare(query);
    
    if (params.length > 0) {
      const { results } = await stmt.bind(...params).all<T>();
      return { results: results || [], success: true };
    } else {
      const { results } = await stmt.all<T>();
      return { results: results || [], success: true };
    }
  } catch (error) {
    console.error('Database query error:', error);
    return {
      results: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}
