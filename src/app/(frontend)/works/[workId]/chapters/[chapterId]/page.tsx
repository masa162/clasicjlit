import { getD1 } from '@/lib/d1';
import ChapterPageContent from './chapter-page-content';
import type { Chapter } from '@/types/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

async function getChapter(chapterId: string): Promise<Chapter | null> {
  try {
    const db = getD1();
    const { results } = await db
      .prepare('SELECT * FROM chapters WHERE id = ?')
      .bind(chapterId)
      .all<Chapter>();
    return results[0] || null;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return null;
  }
}

async function getNextChapter(
  workId: string,
  currentOrder: number
): Promise<Chapter | null> {
  try {
    const db = getD1();
    const { results } = await db
      .prepare(`
        SELECT * FROM chapters 
        WHERE work_id = ? AND chapter_order > ? 
        ORDER BY chapter_order ASC 
        LIMIT 1
      `)
      .bind(workId, currentOrder)
      .all<Chapter>();
    return results[0] || null;
  } catch (error) {
    console.error('Error fetching next chapter:', error);
    return null;
  }
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ workId: string; chapterId: string }>;
}) {
  const { workId, chapterId } = await params;
  const chapter = await getChapter(chapterId);

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  const nextChapter = await getNextChapter(workId, chapter.chapter_order);

  return (
    <ChapterPageContent
      chapter={chapter}
      nextChapterUrl={
        nextChapter
          ? `/works/${workId}/chapters/${nextChapter.id}`
          : undefined
      }
    />
  );
}

// Removed generateStaticParams to avoid build-time database access