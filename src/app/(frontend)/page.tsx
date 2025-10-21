import { getD1 } from '@/lib/d1';
import HomePageContent from './home-page-content';
import type { WorkWithAuthor } from '@/types/database';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getWorks(): Promise<WorkWithAuthor[]> {
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
    return results || [];
  } catch (error) {
    console.error('Error fetching works:', error);
    return [];
  }
}

export default async function HomePage() {
  const works = await getWorks();

  return <HomePageContent works={works} />;
}