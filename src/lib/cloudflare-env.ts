/**
 * Cloudflare Environment Helper
 * 
 * Provides safe access to Cloudflare bindings (D1, R2) across different contexts
 */

import type { CloudflareEnv } from '@/types/cloudflare';

/**
 * Get Cloudflare environment bindings
 * Works in both development (wrangler) and production (Cloudflare Pages)
 */
export function getCloudflareEnv(): CloudflareEnv | null {
  // Method 1: Check process.env (set by Cloudflare Pages at runtime)
  if (process.env.DB && process.env.R2) {
    return {
      DB: process.env.DB as any,
      R2: process.env.R2 as any,
      BASIC_AUTH_USER: process.env.BASIC_AUTH_USER,
      BASIC_AUTH_PASS: process.env.BASIC_AUTH_PASS,
    };
  }

  // Method 2: Check global cloudflare context
  if (typeof globalThis !== 'undefined' && 'cloudflare' in globalThis) {
    const cf = (globalThis as any).cloudflare;
    if (cf?.env) {
      return cf.env as CloudflareEnv;
    }
  }

  return null;
}

