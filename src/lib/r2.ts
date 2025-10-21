/**
 * Cloudflare R2 Storage Client
 * 
 * This module provides access to the Cloudflare R2 object storage.
 * In production (Cloudflare Pages), bindings are available via getRequestContext().
 * In development, you need to use wrangler for local bindings.
 */

import { R2Bucket } from '@cloudflare/workers-types';

/**
 * Get the R2 bucket instance from the current request context
 * This should be called within API routes
 * 
 * In Cloudflare Pages, bindings are automatically injected into process.env at runtime
 */
export function getR2(): R2Bucket {
  // Cloudflare Pages automatically sets process.env.R2 at runtime
  if (process.env.R2) {
    return process.env.R2 as unknown as R2Bucket;
  }

  // Build time: return mock to prevent build errors
  if (typeof window === 'undefined') {
    return createMockR2();
  }

  throw new Error('R2 Bucket binding not configured');
}

/**
 * Create a mock R2 bucket for build time
 */
function createMockR2(): R2Bucket {
  const throwError = () => {
    throw new Error('R2 Bucket binding not configured. This is a build-time mock.');
  };

  return {
    get: throwError,
    put: throwError,
    delete: throwError,
    head: throwError,
    list: throwError,
    createMultipartUpload: throwError,
  } as any;
}

/**
 * Upload a file to R2
 * 
 * @param key - The object key (file path) in R2
 * @param file - The file data (ArrayBuffer)
 * @param contentType - The MIME type of the file
 */
export async function uploadFile(
  key: string,
  file: ArrayBuffer,
  contentType?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const r2 = getR2();
    await r2.put(key, file, {
      httpMetadata: contentType ? { contentType } : undefined,
    });
    return { success: true };
  } catch (error) {
    console.error('R2 upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
}

/**
 * Delete a file from R2
 * 
 * @param key - The object key (file path) in R2
 */
export async function deleteFile(
  key: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const r2 = getR2();
    await r2.delete(key);
    return { success: true };
  } catch (error) {
    console.error('R2 delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown delete error',
    };
  }
}

/**
 * Get the public URL for an R2 object
 * Note: R2 objects are not public by default. You need to configure
 * a custom domain or use signed URLs for access.
 * 
 * @param key - The object key (file path) in R2
 * @param customDomain - Your R2 custom domain (if configured)
 */
export function getPublicUrl(key: string, customDomain?: string): string {
  if (customDomain) {
    return `https://${customDomain}/${key}`;
  }
  // Return relative path if no custom domain is configured
  return `/api/audio/${encodeURIComponent(key)}`;
}
