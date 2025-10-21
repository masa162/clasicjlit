export const runtime = 'edge';

import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check Cloudflare bindings
 */
export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    hasDB: !!process.env.DB,
    hasR2: !!process.env.R2,
    dbType: typeof process.env.DB,
    r2Type: typeof process.env.R2,
    envKeys: Object.keys(process.env).filter(k => 
      !k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY')
    ),
  };

  return NextResponse.json(debugInfo);
}

