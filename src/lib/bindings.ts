/**
 * Cloudflare Bindings Helper
 * 
 * Provides access to Cloudflare bindings in a safe way
 */

import type { CloudflareEnv } from '@/types/cloudflare';

/**
 * Get Cloudflare environment bindings
 * This works in Cloudflare Pages environment
 */
export function getEnv(): CloudflareEnv | null {
  try {
    // For Cloudflare Pages with @cloudflare/next-on-pages
    // Dynamic import to avoid build-time errors
    const cloudflareNextOnPages = require('@cloudflare/next-on-pages');
    
    if (cloudflareNextOnPages?.getRequestContext) {
      const context = cloudflareNextOnPages.getRequestContext();
      if (context?.env) {
        return context.env as CloudflareEnv;
      }
    }
  } catch (error) {
    // getRequestContext is not available (e.g., during build or dev)
    // This is expected and not an error
  }

  return null;
}

