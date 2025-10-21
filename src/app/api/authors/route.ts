/**
 * Authors API Route
 * 
 * Handles CRUD operations for authors
 */

export const runtime = 'edge';

import { getD1 } from '@/lib/d1';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { Author, CreateAuthorRequest } from '@/types/database';

/**
 * GET /api/authors
 * Retrieve all authors
 */
export async function GET() {
  try {
    const db = getD1();
    const { results } = await db
      .prepare(`
        SELECT 
          id, name_jp, name_en, bio_jp, bio_en,
          created_at, updated_at
        FROM authors 
        ORDER BY name_jp ASC
      `)
      .all<Author>();
    
    return NextResponse.json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch authors',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/authors
 * Create a new author
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateAuthorRequest = await req.json();
    const { id, name_jp, name_en, bio_jp, bio_en } = body;

    // Validation
    if (!name_jp) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          message: 'name_jp is required' 
        }, 
        { status: 400 }
      );
    }

    const authorId = id || uuidv4();
    const db = getD1();

    await db
      .prepare(`
        INSERT INTO authors (
          id, name_jp, name_en, bio_jp, bio_en
        ) VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        authorId, 
        name_jp, 
        name_en || null, 
        bio_jp || null, 
        bio_en || null
      )
      .run();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Author created successfully',
        data: { id: authorId }
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create author',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
