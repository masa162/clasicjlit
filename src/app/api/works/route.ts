/**
 * Works API Route
 * 
 * Handles CRUD operations for literary works
 */

import { getD1 } from '@/lib/d1';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { WorkWithAuthor, CreateWorkRequest } from '@/types/database';

/**
 * GET /api/works
 * Retrieve all works with author information
 */
export async function GET() {
  try {
    const db = getD1();
    const { results } = await db
      .prepare(`
        SELECT 
          w.id, 
          w.title_jp, 
          w.title_en, 
          w.description_jp, 
          w.description_en,
          w.author_id,
          a.name_jp as author_name_jp, 
          a.name_en as author_name_en,
          w.created_at,
          w.updated_at
        FROM works w 
        JOIN authors a ON w.author_id = a.id
        ORDER BY w.created_at DESC
      `)
      .all<WorkWithAuthor>();
    
    return NextResponse.json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch works',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/works
 * Create a new work
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateWorkRequest = await req.json();
    const { id, author_id, title_jp, title_en, description_jp, description_en } = body;

    // Validation
    if (!author_id || !title_jp) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          message: 'author_id and title_jp are required' 
        }, 
        { status: 400 }
      );
    }

    const workId = id || uuidv4();
    const db = getD1();

    await db
      .prepare(`
        INSERT INTO works (
          id, author_id, title_jp, title_en, 
          description_jp, description_en
        ) VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        workId, 
        author_id, 
        title_jp, 
        title_en || null, 
        description_jp || null, 
        description_en || null
      )
      .run();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Work created successfully',
        data: { id: workId }
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating work:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create work',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
