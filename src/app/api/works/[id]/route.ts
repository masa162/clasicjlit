import { getD1 } from '@/lib/d1';
import { NextRequest, NextResponse } from 'next/server';
import type { Work, UpdateWorkRequest } from '@/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getD1();
    const { results } = await db
      .prepare(`
        SELECT 
          w.id, w.title_jp, w.title_en, w.description_jp, w.description_en,
          w.author_id, w.created_at, w.updated_at
        FROM works w WHERE id = ?
      `)
      .bind(id)
      .all<Work>();
    
    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Work not found' }, 
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: results[0] });
  } catch (error) {
    console.error('Error fetching work:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch work' },
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
    const body: UpdateWorkRequest = await req.json();
    const { title_jp, title_en, description_jp, description_en, author_id } = body;

    const db = getD1();
    await db
      .prepare(`
        UPDATE works 
        SET title_jp = COALESCE(?, title_jp),
            title_en = COALESCE(?, title_en),
            description_jp = COALESCE(?, description_jp),
            description_en = COALESCE(?, description_en),
            author_id = COALESCE(?, author_id),
            updated_at = datetime('now')
        WHERE id = ?
      `)
      .bind(title_jp, title_en, description_jp, description_en, author_id, id)
      .run();
    
    return NextResponse.json({ success: true, message: 'Work updated' });
  } catch (error) {
    console.error('Error updating work:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update work' },
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
    await db.prepare('DELETE FROM works WHERE id = ?').bind(id).run();
    return NextResponse.json({ success: true, message: 'Work deleted' });
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete work' },
      { status: 500 }
    );
  }
}
