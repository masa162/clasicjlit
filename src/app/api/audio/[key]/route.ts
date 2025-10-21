export const runtime = 'edge';

import { getR2 } from '@/lib/r2';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/audio/[key]
 * Retrieve audio file from R2 storage
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    // Construct full R2 key (add audio/ prefix)
    const r2Key = `audio/${key}`;
    
    console.log('Fetching audio file from R2:', r2Key);
    
    const r2 = getR2();
    const object = await r2.get(r2Key);

    if (!object) {
      console.error('Audio file not found in R2:', r2Key);
      return NextResponse.json(
        { success: false, error: 'Audio file not found' },
        { status: 404 }
      );
    }

    // Get content type from R2 object metadata
    const contentType = object.httpMetadata?.contentType || 'audio/mpeg';

    // Convert R2 body to ArrayBuffer
    const arrayBuffer = await object.arrayBuffer();

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Length', arrayBuffer.byteLength.toString());

    return new NextResponse(arrayBuffer, {
      headers,
    });
  } catch (error) {
    console.error('Error fetching audio file:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch audio file',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

