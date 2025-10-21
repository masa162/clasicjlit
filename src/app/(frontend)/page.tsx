import { getD1 } from '@/lib/d1';
import HomePageContent from './home-page-content';
import type { WorkWithAuthor } from '@/types/database';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

async function getWorks(): Promise<WorkWithAuthor[]> {
  try {
    const db = getD1();
    
    const stmt = db.prepare(`
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
    `);
    
    const { results } = await stmt.all<WorkWithAuthor>();
    return results || [];
  } catch (error) {
    console.error('Error fetching works:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      isDev: process.env.NODE_ENV === 'development'
    });
    
    // In development without bindings, return empty array (don't crash)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Running in development mode without D1 bindings. Use `wrangler pages dev` for full functionality.');
      return [];
    }
    
    // In production, this is a real error
    throw error;
  }
}

export default async function HomePage() {
  const works = await getWorks();

  return <HomePageContent works={works} />;
}