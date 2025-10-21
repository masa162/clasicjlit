/**
 * Cloudflare environment bindings
 */

import { D1Database, R2Bucket } from '@cloudflare/workers-types';

export interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
  BASIC_AUTH_USER?: string;
  BASIC_AUTH_PASS?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB?: D1Database;
      R2?: R2Bucket;
      BASIC_AUTH_USER?: string;
      BASIC_AUTH_PASS?: string;
      R2_CUSTOM_DOMAIN?: string;
    }
  }
}

