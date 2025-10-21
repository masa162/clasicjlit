import { getD1 } from '@/lib/d1';
import WorkPageContent from './work-page-content';
import type { Work, Chapter } from '@/types/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

interface WorkWithAuthor extends Work {
  author_name_jp: string;
  author_name_en: string | null;
}

async function getWork(workId: string): Promise<WorkWithAuthor | null> {
  try {
    const db = getD1();
    const { results } = await db
      .prepare(`
        SELECT 
          w.id, w.title_jp, w.title_en, w.description_jp, w.description_en,
          w.author_id, w.created_at, w.updated_at,
          a.name_jp as author_name_jp, a.name_en as author_name_en
        FROM works w 
        JOIN authors a ON w.author_id = a.id 
        WHERE w.id = ?
      `)
      .bind(workId)
      .all<WorkWithAuthor>();
    return results[0] || null;
  } catch (error) {
    console.error('Error fetching work:', error);
    return null;
  }
}

async function getChapters(workId: string): Promise<Chapter[]> {
  try {
    const db = getD1();
    const { results } = await db
      .prepare(`
        SELECT * FROM chapters 
        WHERE work_id = ? 
        ORDER BY chapter_order ASC
      `)
      .bind(workId)
      .all<Chapter>();
    return results || [];
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ workId: string }>;
}) {
  const { workId } = await params;
  const work = await getWork(workId);
  const chapters = await getChapters(workId);

  if (!work) {
    return <div>Work not found</div>;
  }

  return <WorkPageContent work={work} chapters={chapters} />;
}

// Removed generateStaticParams to avoid build-time database access