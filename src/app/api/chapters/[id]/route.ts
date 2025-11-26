export const runtime = 'edge';

import { getD1 } from '@/lib/d1';
import { NextRequest, NextResponse } from 'next/server';
import type { Chapter, UpdateChapterRequest } from '@/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getD1();
    const { results } = await db
      .prepare('SELECT * FROM chapters WHERE id = ?')
      .bind(id)
      .all<Chapter>();
    
    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Chapter not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: results[0] });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateChapterRequest = await req.json();
    
    // Define allowed columns for update
    const allowedColumns = [
      'work_id',
      'chapter_order',
      'title_jp',
      'title_en',
      'audio_url',
      'content_jp',
      'content_en',
      'duration_seconds'
    ];

    const updates: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    for (const col of allowedColumns) {
      if (col in body) {
        updates.push(`${col} = ?`);
        // @ts-ignore - body is typed but we're iterating dynamically
        values.push(body[col]);
      }
    }

    const db = getD1();
    
    // Only run update if there are changes
    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      values.push(id);

      const query = `UPDATE chapters SET ${updates.join(', ')} WHERE id = ?`;
      
      await db
        .prepare(query)
        .bind(...values)
        .run();
    }

    // Update categories if provided
    if ('category_ids' in body) {
      const category_ids = body.category_ids;
      
      // Delete existing category relationships
      await db
        .prepare('DELETE FROM chapter_categories WHERE chapter_id = ?')
        .bind(id)
        .run();
      
      // Insert new relationships if any
      if (category_ids && Array.isArray(category_ids)) {
        for (const categoryId of category_ids) {
          await db
            .prepare('INSERT INTO chapter_categories (chapter_id, category_id) VALUES (?, ?)')
            .bind(id, categoryId)
            .run();
        }
      }
    }
    
    return NextResponse.json({ success: true, message: 'Chapter updated' });
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update chapter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getD1();
    await db.prepare('DELETE FROM chapters WHERE id = ?').bind(id).run();
    return NextResponse.json({ success: true, message: 'Chapter deleted' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
