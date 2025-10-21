/**
 * Chapters API Route
 * 
 * Handles CRUD operations for chapters
 */

export const runtime = 'edge';

import { getD1 } from '@/lib/d1';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { Chapter, CreateChapterRequest } from '@/types/database';

/**
 * GET /api/chapters
 * Retrieve all chapters (optionally filtered by work_id)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workId = searchParams.get('work_id');
    
    const db = getD1();
    let query = `
      SELECT 
        c.id, c.work_id, c.chapter_order, 
        c.title_jp, c.title_en, c.audio_url,
        c.content_jp, c.content_en, c.duration_seconds,
        c.created_at, c.updated_at,
        w.title_jp as work_title_jp,
        w.title_en as work_title_en
      FROM chapters c
      JOIN works w ON c.work_id = w.id
    `;
    
    if (workId) {
      query += ` WHERE c.work_id = ?`;
    }
    
    query += ` ORDER BY c.work_id, c.chapter_order ASC`;
    
    const stmt = workId 
      ? db.prepare(query).bind(workId)
      : db.prepare(query);
      
    const { results } = await stmt.all<Chapter>();
    
    return NextResponse.json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch chapters',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/chapters
 * Create a new chapter
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateChapterRequest = await req.json();
    const { 
      id, work_id, chapter_order, title_jp, title_en, 
      audio_url, content_jp, content_en, duration_seconds,
      category_ids 
    } = body;

    // Validation
    if (!work_id || !title_jp || !audio_url || chapter_order === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          message: 'work_id, title_jp, audio_url, and chapter_order are required' 
        }, 
        { status: 400 }
      );
    }

    const chapterId = id || uuidv4();
    const db = getD1();

    // Insert chapter
    await db
      .prepare(`
        INSERT INTO chapters (
          id, work_id, chapter_order, title_jp, title_en, 
          audio_url, content_jp, content_en, duration_seconds
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        chapterId, work_id, chapter_order, 
        title_jp, title_en || null, audio_url,
        content_jp || null, content_en || null, 
        duration_seconds || null
      )
      .run();

    // Insert chapter-category relationships if provided
    if (category_ids && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        await db
          .prepare(`
            INSERT INTO chapter_categories (chapter_id, category_id) 
            VALUES (?, ?)
          `)
          .bind(chapterId, categoryId)
          .run();
      }
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Chapter created successfully',
        data: { id: chapterId }
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create chapter',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
