/**
 * Categories API Route
 * 
 * Handles CRUD operations for categories
 */

export const runtime = 'edge';

import { getD1 } from '@/lib/d1';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { Category, CreateCategoryRequest } from '@/types/database';

/**
 * GET /api/categories
 * Retrieve all categories
 */
export async function GET() {
  try {
    const db = getD1();
    const { results } = await db
      .prepare(`
        SELECT 
          id, name_jp, name_en, created_at, updated_at
        FROM categories 
        ORDER BY name_jp ASC
      `)
      .all<Category>();
    
    return NextResponse.json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create a new category
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateCategoryRequest = await req.json();
    const { id, name_jp, name_en } = body;

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

    const categoryId = id || uuidv4();
    const db = getD1();

    await db
      .prepare(`
        INSERT INTO categories (id, name_jp, name_en) 
        VALUES (?, ?, ?)
      `)
      .bind(categoryId, name_jp, name_en || null)
      .run();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Category created successfully',
        data: { id: categoryId }
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create category',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
