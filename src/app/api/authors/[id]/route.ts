export const runtime = 'edge';

import { getD1 } from '@/lib/d1';
import { NextRequest, NextResponse } from 'next/server';
import type { Author, UpdateAuthorRequest } from '@/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getD1();
    const { results } = await db
      .prepare('SELECT * FROM authors WHERE id = ?')
      .bind(id)
      .all<Author>();
    
    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Author not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: results[0] });
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch author' },
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
    const body: UpdateAuthorRequest = await req.json();
    const { name_jp, name_en, bio_jp, bio_en } = body;

    const db = getD1();
    await db
      .prepare(`
        UPDATE authors 
        SET name_jp = COALESCE(?, name_jp),
            name_en = COALESCE(?, name_en),
            bio_jp = COALESCE(?, bio_jp),
            bio_en = COALESCE(?, bio_en),
            updated_at = datetime('now')
        WHERE id = ?
      `)
      .bind(name_jp, name_en, bio_jp, bio_en, id)
      .run();
    
    return NextResponse.json({ success: true, message: 'Author updated' });
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update author' },
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
    await db.prepare('DELETE FROM authors WHERE id = ?').bind(id).run();
    return NextResponse.json({ success: true, message: 'Author deleted' });
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete author' },
      { status: 500 }
    );
  }
}
