export const runtime = 'edge';

import { uploadFile, getPublicUrl } from '@/lib/r2';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeFilename } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File is required' },
        { status: 400 }
      );
    }

    // Validate file type (audio files only)
    const allowedTypes = ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${file.type}. Allowed: AAC, MP3, WAV, M4A` },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const sanitizedName = sanitizeFilename(file.name);
    const timestamp = Date.now();
    const key = `audio/${timestamp}-${sanitizedName}`;

    console.log('Uploading file to R2:', { key, size: file.size, type: file.type });

    const result = await uploadFile(key, buffer, file.type);

    if (!result.success) {
      console.error('R2 upload failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Return the API path to access this file
    const url = `/api/audio/${timestamp}-${sanitizedName}`;

    console.log('File uploaded successfully:', { key, url });

    return NextResponse.json({
      success: true,
      data: { url, key }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
