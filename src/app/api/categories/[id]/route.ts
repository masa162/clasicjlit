import { getD1 } from '@/lib/d1';
import { NextRequest, NextResponse } from 'next/server';
import type { Category, UpdateCategoryRequest } from '@/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getD1();
    const { results } = await db
      .prepare('SELECT * FROM categories WHERE id = ?')
      .bind(id)
      .all<Category>();
    
    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: results[0] });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
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
    const body: UpdateCategoryRequest = await req.json();
    const { name_jp, name_en } = body;

    const db = getD1();
    await db
      .prepare(`
        UPDATE categories 
        SET name_jp = COALESCE(?, name_jp),
            name_en = COALESCE(?, name_en),
            updated_at = datetime('now')
        WHERE id = ?
      `)
      .bind(name_jp, name_en, id)
      .run();
    
    return NextResponse.json({ success: true, message: 'Category updated' });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
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
    await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
